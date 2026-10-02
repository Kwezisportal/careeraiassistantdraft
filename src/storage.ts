import type { CVData, AIResult, CVTemplate, AppView } from '@/types';

export const initialCVData: CVData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedinUrl: '',
  },
  careerProfile: {
    targetJobTitle: '',
    careerLevel: 'graduate',
    existingSummary: '',
  },
  workExperience: [],
  education: [],
  skills: {
    relevantSkills: '',
    certifications: '',
    languages: '',
  },
  jobDescription: '',
};

export const initialAIResult: AIResult = {
  summary: '',
  bullets: {},
  atsAnalysis: null,
};

export const STORAGE_KEY = 'careercraft-ai-data';

interface PersistedState {
  cvData: CVData;
  aiResult: AIResult;
  template: CVTemplate;
}

export function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    return {
      cvData: { ...initialCVData, ...parsed.cvData },
      aiResult: { ...initialAIResult, ...parsed.aiResult },
      template: parsed.template || 'modern',
    };
  } catch {
    return null;
  }
}

export function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be full or unavailable; non-fatal
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // non-fatal
  }
}

export const defaultView: AppView = 'home';
