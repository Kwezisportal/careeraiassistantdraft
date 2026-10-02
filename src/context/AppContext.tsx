import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { CVData, AIResult, CVTemplate, AppView, WorkExperience, Education } from '@/types';
import { initialCVData, initialAIResult, loadState, saveState, clearState } from '@/storage';

interface AppContextValue {
  cvData: CVData;
  aiResult: AIResult;
  template: CVTemplate;
  currentView: AppView;
  builderStep: number;
  setCurrentView: (view: AppView) => void;
  setBuilderStep: (step: number) => void;
  updatePersonalInfo: (field: keyof CVData['personalInfo'], value: string) => void;
  updateCareerProfile: (field: keyof CVData['careerProfile'], value: string) => void;
  addWorkExperience: () => void;
  updateWorkExperience: (id: string, field: keyof WorkExperience, value: string) => void;
  removeWorkExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: keyof Education, value: string) => void;
  removeEducation: (id: string) => void;
  updateSkills: (field: keyof CVData['skills'], value: string) => void;
  updateJobDescription: (value: string) => void;
  setAISummary: (summary: string) => void;
  setAIBullets: (experienceId: string, bullets: string[]) => void;
  acceptAIBullets: (experienceId: string) => void;
  setATSAnalysis: (analysis: AIResult['atsAnalysis']) => void;
  setTemplate: (template: CVTemplate) => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const persisted = loadState();
  const [cvData, setCvData] = useState<CVData>(persisted?.cvData ?? initialCVData);
  const [aiResult, setAiResult] = useState<AIResult>(persisted?.aiResult ?? initialAIResult);
  const [template, setTemplateState] = useState<CVTemplate>(persisted?.template ?? 'modern');
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [builderStep, setBuilderStep] = useState(0);

  useEffect(() => {
    saveState({ cvData, aiResult, template });
  }, [cvData, aiResult, template]);

  const updatePersonalInfo = useCallback((field: keyof CVData['personalInfo'], value: string) => {
    setCvData((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
  }, []);

  const updateCareerProfile = useCallback((field: keyof CVData['careerProfile'], value: string) => {
    setCvData((prev) => ({ ...prev, careerProfile: { ...prev.careerProfile, [field]: value } }));
  }, []);

  const addWorkExperience = useCallback(() => {
    setCvData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        { id: generateId(), jobTitle: '', employer: '', startDate: '', endDate: '', responsibilities: '', achievements: '' },
      ],
    }));
  }, []);

  const updateWorkExperience = useCallback((id: string, field: keyof WorkExperience, value: string) => {
    setCvData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((we) => (we.id === id ? { ...we, [field]: value } : we)),
    }));
  }, []);

  const removeWorkExperience = useCallback((id: string) => {
    setCvData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((we) => we.id !== id),
    }));
    setAiResult((prev) => {
      const newBullets = { ...prev.bullets };
      delete newBullets[id];
      return { ...prev, bullets: newBullets };
    });
  }, []);

  const addEducation = useCallback(() => {
    setCvData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: generateId(), qualification: '', institution: '', dates: '', coursework: '' },
      ],
    }));
  }, []);

  const updateEducation = useCallback((id: string, field: keyof Education, value: string) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.map((ed) => (ed.id === id ? { ...ed, [field]: value } : ed)),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.filter((ed) => ed.id !== id),
    }));
  }, []);

  const updateSkills = useCallback((field: keyof CVData['skills'], value: string) => {
    setCvData((prev) => ({ ...prev, skills: { ...prev.skills, [field]: value } }));
  }, []);

  const updateJobDescription = useCallback((value: string) => {
    setCvData((prev) => ({ ...prev, jobDescription: value }));
  }, []);

  const setAISummary = useCallback((summary: string) => {
    setAiResult((prev) => ({ ...prev, summary }));
  }, []);

  const setAIBullets = useCallback((experienceId: string, bullets: string[]) => {
    setAiResult((prev) => ({ ...prev, bullets: { ...prev.bullets, [experienceId]: bullets } }));
  }, []);

  const acceptAIBullets = useCallback((experienceId: string) => {
    setAiResult((prev) => {
      const bullets = prev.bullets[experienceId];
      if (!bullets) return prev;
      const bulletText = bullets.map((b) => `• ${b}`).join('\n');
      setCvData((cvPrev) => ({
        ...cvPrev,
        workExperience: cvPrev.workExperience.map((we) =>
          we.id === experienceId ? { ...we, responsibilities: bulletText } : we
        ),
      }));
      return prev;
    });
  }, []);

  const setATSAnalysis = useCallback((analysis: AIResult['atsAnalysis']) => {
    setAiResult((prev) => ({ ...prev, atsAnalysis: analysis }));
  }, []);

  const setTemplate = useCallback((t: CVTemplate) => {
    setTemplateState(t);
  }, []);

  const clearAllData = useCallback(() => {
    clearState();
    setCvData(initialCVData);
    setAiResult(initialAIResult);
    setBuilderStep(0);
  }, []);

  const value: AppContextValue = {
    cvData,
    aiResult,
    template,
    currentView,
    builderStep,
    setCurrentView,
    setBuilderStep,
    updatePersonalInfo,
    updateCareerProfile,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    addEducation,
    updateEducation,
    removeEducation,
    updateSkills,
    updateJobDescription,
    setAISummary,
    setAIBullets,
    acceptAIBullets,
    setATSAnalysis,
    setTemplate,
    clearAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
