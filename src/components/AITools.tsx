import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/Field';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { generateSummary, improveBullets, analyseATS } from '@/ai/service';
import type { ATSAnalysis } from '@/types';
import {
  Sparkles,
  FileText,
  CheckCircle2,
  Clipboard,
  ClipboardCheck,
  RefreshCw,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Check,
  TrendingUp,
} from 'lucide-react';

type Tab = 'summary' | 'bullets' | 'ats';
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export function AITools() {
  const { cvData, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  const tabs: { id: Tab; label: string; icon: typeof Sparkles }[] = [
    { id: 'summary', label: 'Professional Summary', icon: Sparkles },
    { id: 'bullets', label: 'Experience Bullets', icon: FileText },
    { id: 'ats', label: 'ATS Analysis', icon: CheckCircle2 },
  ];

  const hasBasicData = cvData.personalInfo.fullName.trim() && cvData.careerProfile.targetJobTitle.trim();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">AI Content Tools</h1>
        <p className="text-navy-400 text-sm">
          Use AI to generate, improve, and analyse your CV content. All content uses your actual inputs — the AI will
          never invent experience or qualifications.
        </p>
      </div>

      {!hasBasicData && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">Add your details first</p>
            <p className="text-sm text-amber-700 mt-0.5">
              The AI tools work best when you've entered your personal information and career profile.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3 border-amber-300 text-amber-800 hover:bg-amber-100"
              onClick={() => { setCurrentView('builder'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              Go to CV Builder
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-navy-100 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                active
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-navy-400 hover:text-navy-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'summary' && <SummaryTool />}
      {activeTab === 'bullets' && <BulletsTool />}
      {activeTab === 'ats' && <ATSTool />}

      {/* Footer navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-navy-100">
        <Button variant="outline" onClick={() => { setCurrentView('builder'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <ArrowLeft className="w-4 h-4" />
          Back to Builder
        </Button>
        <Button onClick={() => { setCurrentView('preview'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          Preview CV
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ===== Summary Tool =====

function SummaryTool() {
  const { cvData, aiResult, setAISummary } = useApp();
  const { copied, copy } = useCopyToClipboard();
  const [state, setState] = useState<LoadingState>('idle');
  const [error, setError] = useState('');
  const [editableText, setEditableText] = useState('');

  const displayText = editableText || aiResult.summary;

  const handleGenerate = async () => {
    setState('loading');
    setError('');
    try {
      const result = await generateSummary(cvData);
      setAISummary(result);
      setEditableText('');
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setState('error');
    }
  };

  const handleAccept = () => {
    const finalText = editableText || aiResult.summary;
    setAISummary(finalText);
    setEditableText('');
  };

  const handleEdit = (value: string) => {
    setEditableText(value);
  };

  return (
    <div className="space-y-5">
      <div className="bg-cream-50 rounded-lg p-4 border border-navy-100">
        <h3 className="font-semibold text-navy-900 mb-1">Professional Summary Generator</h3>
        <p className="text-sm text-navy-400">
          Generates a 60–90 word summary tailored to your target role and actual background. Uses your career profile,
          skills, experience, and (if provided) the job description for keyword alignment.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleGenerate} disabled={state === 'loading'}>
          {state === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : aiResult.summary ? (
            <>
              <RefreshCw className="w-4 h-4" />
              Regenerate Summary
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Summary
            </>
          )}
        </Button>
        {aiResult.summary && (
          <Button variant="outline" onClick={() => copy(displayText)}>
            {copied ? <ClipboardCheck className="w-4 h-4 text-teal-600" /> : <Clipboard className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        )}
      </div>

      {state === 'error' && (
        <ErrorDisplay error={error} onRetry={handleGenerate} />
      )}

      {(state === 'success' || aiResult.summary) && displayText && (
        <div className="space-y-3 animate-fade-in">
          <div className="bg-white rounded-lg border border-navy-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-navy-400 uppercase tracking-wide">Generated Summary</span>
              <span className="text-xs text-navy-300">{displayText.trim().split(/\s+/).length} words</span>
            </div>
            <TextArea
              rows={6}
              value={displayText}
              onChange={(e) => handleEdit(e.target.value)}
              className="text-sm leading-relaxed"
            />
            <p className="text-xs text-navy-400 mt-2">
              You can edit the text above. Click "Accept" to save it to your CV.
            </p>
          </div>
          <Button onClick={handleAccept}>
            <Check className="w-4 h-4" />
            Accept into CV
          </Button>
        </div>
      )}
    </div>
  );
}

// ===== Bullets Tool =====

function BulletsTool() {
  const { cvData, aiResult, setAIBullets, acceptAIBullets } = useApp();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [errorId, setErrorId] = useState<string | null>(null);

  if (cvData.workExperience.length === 0) {
    return (
      <div className="text-center py-12 bg-cream-50 rounded-lg border border-dashed border-navy-200">
        <FileText className="w-10 h-10 text-navy-300 mx-auto mb-3" />
        <p className="text-navy-400 text-sm">No work experience entries to improve.</p>
        <p className="text-navy-300 text-xs mt-1">Add work experience in the CV Builder first.</p>
      </div>
    );
  }

  const handleImprove = async (experienceId: string) => {
    setLoadingId(experienceId);
    setError('');
    setErrorId(null);
    try {
      const bullets = await improveBullets(cvData, experienceId);
      setAIBullets(experienceId, bullets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setErrorId(experienceId);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-cream-50 rounded-lg p-4 border border-navy-100">
        <h3 className="font-semibold text-navy-900 mb-1">Experience Bullet Point Improver</h3>
        <p className="text-sm text-navy-400">
          Rewrites your responsibilities into clear, action-oriented CV bullet points. Preserves your original meaning —
          the AI will never invent numbers, metrics, or achievements.
        </p>
      </div>

      {cvData.workExperience.map((we) => {
        const bullets = aiResult.bullets[we.id];
        const isLoading = loadingId === we.id;
        const hasError = errorId === we.id;

        return (
          <div key={we.id} className="bg-white rounded-lg border border-navy-100 p-5 space-y-4">
            <div>
              <h4 className="font-medium text-navy-900">{we.jobTitle || 'Untitled role'}</h4>
              <p className="text-sm text-navy-400">{we.employer || 'Unknown employer'}</p>
            </div>

            {we.responsibilities && (
              <div>
                <span className="text-xs font-medium text-navy-400 uppercase tracking-wide">Original</span>
                <p className="text-sm text-navy-600 mt-1 p-3 bg-cream-50 rounded-lg whitespace-pre-wrap">
                  {we.responsibilities}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleImprove(we.id)} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Improving...
                  </>
                ) : bullets ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Improve Bullets
                  </>
                )}
              </Button>
              {bullets && (
                <Button size="sm" variant="primary" onClick={() => acceptAIBullets(we.id)}>
                  <Check className="w-4 h-4" />
                  Accept into CV
                </Button>
              )}
            </div>

            {hasError && <ErrorDisplay error={error} onRetry={() => handleImprove(we.id)} />}

            {bullets && (
              <div className="animate-fade-in space-y-2">
                <span className="text-xs font-medium text-teal-600 uppercase tracking-wide">AI-Improved Bullets</span>
                <BulletEditor
                  bullets={bullets}
                  onChange={(newBullets) => setAIBullets(we.id, newBullets)}
                />
                <p className="text-xs text-navy-400">
                  You can edit each bullet above. Click "Accept into CV" to replace your original responsibilities.
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function BulletEditor({ bullets, onChange }: { bullets: string[]; onChange: (bullets: string[]) => void }) {
  const { copied, copy } = useCopyToClipboard();

  const updateBullet = (index: number, value: string) => {
    const newBullets = [...bullets];
    newBullets[index] = value;
    onChange(newBullets);
  };

  return (
    <div className="space-y-2">
      {bullets.map((bullet, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="text-teal-600 font-bold mt-2.5 flex-shrink-0">•</span>
          <TextArea
            rows={2}
            value={bullet}
            onChange={(e) => updateBullet(i, e.target.value)}
            className="text-sm"
          />
        </div>
      ))}
      <Button size="sm" variant="ghost" onClick={() => copy(bullets.map((b) => `• ${b}`).join('\n'))}>
        {copied ? <ClipboardCheck className="w-4 h-4 text-teal-600" /> : <Clipboard className="w-4 h-4" />}
        {copied ? 'Copied!' : 'Copy all bullets'}
      </Button>
    </div>
  );
}

// ===== ATS Analysis Tool =====

function ATSTool() {
  const { cvData, aiResult, setATSAnalysis } = useApp();
  const [state, setState] = useState<LoadingState>('idle');
  const [error, setError] = useState('');

  const hasJobDescription = cvData.jobDescription.trim().length > 0;

  const handleAnalyse = async () => {
    setState('loading');
    setError('');
    try {
      const result = await analyseATS(cvData);
      setATSAnalysis(result);
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setState('error');
    }
  };

  const analysis = aiResult.atsAnalysis;

  return (
    <div className="space-y-5">
      <div className="bg-cream-50 rounded-lg p-4 border border-navy-100">
        <h3 className="font-semibold text-navy-900 mb-1">ATS & Job Description Analyser</h3>
        <p className="text-sm text-navy-400">
          Compares your CV information against the job description to identify matched keywords, gaps, and
          actionable recommendations. This is an approximate, transparent comparison — not a real ATS score.
        </p>
      </div>

      {!hasJobDescription && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            No job description provided. You can still run the analysis, but results will be limited.
            Add a job description in the CV Builder (Step 6) for a more useful comparison.
          </p>
        </div>
      )}

      <Button onClick={handleAnalyse} disabled={state === 'loading'}>
        {state === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analysing...
          </>
        ) : analysis ? (
          <>
            <RefreshCw className="w-4 h-4" />
            Re-run Analysis
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Run Analysis
          </>
        )}
      </Button>

      {state === 'error' && <ErrorDisplay error={error} onRetry={handleAnalyse} />}

      {analysis && (state === 'success' || state === 'idle') && (
        <AnalysisResult analysis={analysis} />
      )}
    </div>
  );
}

function AnalysisResult({ analysis }: { analysis: ATSAnalysis }) {
  const { copied, copy } = useCopyToClipboard();
  const fullText = formatAnalysisAsText(analysis);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Match percentage */}
      <div className="bg-white rounded-lg border border-navy-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-navy-700">Approximate Match</span>
          <Button size="sm" variant="ghost" onClick={() => copy(fullText)}>
            {copied ? <ClipboardCheck className="w-4 h-4 text-teal-600" /> : <Clipboard className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy analysis'}
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#14b8a6"
                strokeWidth="8"
                strokeDasharray={`${(analysis.approximateMatchPercentage / 100) * 251.2} 251.2`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-navy-900">{analysis.approximateMatchPercentage}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-navy-600 font-medium">Approximate keyword overlap</p>
            <p className="text-xs text-navy-400 mt-1">
              This is a transparent comparison based on the supplied information, not a real ATS score.
              A missing keyword does not mean you lack that skill — it means it's not mentioned in your CV.
            </p>
          </div>
        </div>
      </div>

      {/* Matched keywords */}
      {analysis.matchedKeywords.length > 0 && (
        <AnalysisSection title="Keywords already in your CV" color="teal">
          <div className="flex flex-wrap gap-2">
            {analysis.matchedKeywords.map((kw, i) => (
              <span key={i} className="px-3 py-1.5 bg-teal-50 text-teal-700 text-sm rounded-lg border border-teal-100">
                {kw}
              </span>
            ))}
          </div>
        </AnalysisSection>
      )}

      {/* Missing keywords */}
      {analysis.missingKeywords.length > 0 && (
        <AnalysisSection title="Keywords from the job description not yet in your CV" color="amber">
          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords.map((kw, i) => (
              <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-800 text-sm rounded-lg border border-amber-100">
                {kw}
              </span>
            ))}
          </div>
          <p className="text-xs text-navy-400 mt-2">
            These keywords appear in the job description but not in your CV. This does not mean you lack these skills —
            consider adding them if they apply to you.
          </p>
        </AnalysisSection>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <AnalysisSection title="Suggested improvements" color="navy">
          <ul className="space-y-2">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-navy-600">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </AnalysisSection>
      )}

      {/* Gaps */}
      {analysis.gaps.length > 0 && (
        <AnalysisSection title="Potential gaps" color="red">
          <ul className="space-y-2">
            {analysis.gaps.map((g, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-navy-600">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                {g}
              </li>
            ))}
          </ul>
        </AnalysisSection>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <AnalysisSection title="Actionable recommendations" color="teal">
          <ul className="space-y-2">
            {analysis.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-navy-600">
                <TrendingUp className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
        </AnalysisSection>
      )}
    </div>
  );
}

function AnalysisSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  const colorMap: Record<string, string> = {
    teal: 'border-teal-100',
    amber: 'border-amber-100',
    navy: 'border-navy-100',
    red: 'border-red-100',
  };
  return (
    <div className={`bg-white rounded-lg border ${colorMap[color] || 'border-navy-100'} p-5`}>
      <h4 className="font-medium text-navy-900 mb-3">{title}</h4>
      {children}
    </div>
  );
}

function formatAnalysisAsText(a: ATSAnalysis): string {
  const lines: string[] = [
    `ATS & Job Description Analysis`,
    `Approximate match: ${a.approximateMatchPercentage}%`,
    '',
    `Keywords in your CV: ${a.matchedKeywords.join(', ') || 'None'}`,
    '',
    `Keywords not yet in your CV: ${a.missingKeywords.join(', ') || 'None'}`,
    '',
    `Suggestions:`,
    ...a.suggestions.map((s) => `• ${s}`),
    '',
    `Potential gaps:`,
    ...a.gaps.map((g) => `• ${g}`),
    '',
    `Recommendations:`,
    ...a.recommendations.map((r) => `• ${r}`),
  ];
  return lines.join('\n');
}

function ErrorDisplay({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-900">Something went wrong</p>
          <p className="text-sm text-red-700 mt-0.5">{error}</p>
          <Button size="sm" variant="outline" className="mt-3 border-red-300 text-red-700 hover:bg-red-100" onClick={onRetry}>
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
