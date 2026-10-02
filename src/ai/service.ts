import type { CVData, ATSAnalysis } from '@/types';
import { buildSummaryPrompt, buildBulletsPrompt, buildATSAnalysisPrompt } from '@/ai/prompts';

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-cv-assistant`;

interface AIResponse {
  content: string;
  error?: string;
}

async function callEdgeFunction(system: string, user: string, jsonMode: boolean): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  };

  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ system, user, jsonMode }),
  });

  if (!response.ok) {
    let errorMsg = `Request failed (${response.status})`;
    try {
      const errBody = await response.json();
      if (errBody.error) errorMsg = errBody.error;
    } catch {
      // response body wasn't JSON
    }
    throw new Error(errorMsg);
  }

  const data: AIResponse = await response.json();
  if (data.error) throw new Error(data.error);
  return data.content;
}

export async function generateSummary(cvData: CVData): Promise<string> {
  const { system, user } = buildSummaryPrompt(cvData);
  const content = await callEdgeFunction(system, user, false);
  const cleaned = content.trim();
  if (!cleaned) throw new Error('The AI returned an empty response. Please try again.');
  return cleaned;
}

export async function improveBullets(cvData: CVData, experienceId: string): Promise<string[]> {
  const { system, user } = buildBulletsPrompt(cvData, experienceId);
  const content = await callEdgeFunction(system, user, true);

  let parsed: { bullets: string[] };
  try {
    // Strip markdown code fences if present
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('The AI returned an unexpected format. Please try again.');
  }

  if (!parsed.bullets || !Array.isArray(parsed.bullets) || parsed.bullets.length === 0) {
    throw new Error('The AI did not return any bullet points. Please try again.');
  }

  return parsed.bullets.filter((b) => typeof b === 'string' && b.trim().length > 0);
}

export async function analyseATS(cvData: CVData): Promise<ATSAnalysis> {
  const { system, user } = buildATSAnalysisPrompt(cvData);
  const content = await callEdgeFunction(system, user, true);

  let parsed: ATSAnalysis;
  try {
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('The AI returned an unexpected format for the analysis. Please try again.');
  }

  if (typeof parsed.approximateMatchPercentage !== 'number') {
    parsed.approximateMatchPercentage = 0;
  }

  return {
    matchedKeywords: Array.isArray(parsed.matchedKeywords) ? parsed.matchedKeywords : [],
    missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
    approximateMatchPercentage: Math.max(0, Math.min(100, Math.round(parsed.approximateMatchPercentage))),
  };
}
