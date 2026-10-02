export type CareerLevel = 'graduate' | 'entry-level' | 'experienced' | 'career-changer';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
}

export interface CareerProfile {
  targetJobTitle: string;
  careerLevel: CareerLevel;
  existingSummary: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  employer: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  achievements: string;
}

export interface Education {
  id: string;
  qualification: string;
  institution: string;
  dates: string;
  coursework: string;
}

export interface Skills {
  relevantSkills: string;
  certifications: string;
  languages: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  careerProfile: CareerProfile;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skills;
  jobDescription: string;
}

export type AIFeatureType = 'summary' | 'bullets' | 'ats-analysis';

export interface AIResult {
  summary: string;
  bullets: { [experienceId: string]: string[] };
  atsAnalysis: ATSAnalysis | null;
}

export interface ATSAnalysis {
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  gaps: string[];
  recommendations: string[];
  approximateMatchPercentage: number;
}

export type CVTemplate = 'modern' | 'classic';

export type AppView = 'home' | 'builder' | 'ai-tools' | 'preview' | 'responsible-ai';

export interface TimeSavedResult {
  timeSaved: number;
  percentageSaved: number;
}
