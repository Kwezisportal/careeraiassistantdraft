import type { CVData, AIResult, WorkExperience, Education } from '@/types';

export function parseList(text: string): string[] {
  if (!text.trim()) return [];
  return text
    .split(/[,;•\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function parseBulletPoints(text: string): string[] {
  if (!text.trim()) return [];
  return text
    .split(/\n+/)
    .map((line) => line.replace(/^[•\-*]\s*/, '').trim())
    .filter((line) => line.length > 0);
}

export function formatDateRange(start: string, end: string): string {
  const s = start.trim();
  const e = end.trim();
  if (s && e) return `${s} – ${e}`;
  if (s) return s;
  if (e) return e;
  return '';
}

export function getSummary(cvData: CVData, aiResult: AIResult): string {
  return aiResult.summary.trim() || cvData.careerProfile.existingSummary.trim();
}

export function getExperienceBullets(we: WorkExperience, aiResult: AIResult): string[] {
  const aiBullets = aiResult.bullets[we.id];
  if (aiBullets && aiBullets.length > 0) return aiBullets;

  const parsed = parseBulletPoints(we.responsibilities);
  if (parsed.length > 0) return parsed;

  if (we.responsibilities.trim()) return [we.responsibilities.trim()];
  return [];
}

export function hasContactInfo(cvData: CVData): boolean {
  const p = cvData.personalInfo;
  return !!(p.email.trim() || p.phone.trim() || p.location.trim() || p.linkedinUrl.trim());
}

export function hasExperience(cvData: CVData): boolean {
  return cvData.workExperience.some((we) => we.jobTitle.trim() || we.employer.trim() || we.responsibilities.trim());
}

export function hasEducation(cvData: CVData): boolean {
  return cvData.education.some((ed) => ed.qualification.trim() || ed.institution.trim());
}

export function hasSkills(cvData: CVData): boolean {
  return !!cvData.skills.relevantSkills.trim();
}

export function hasCertifications(cvData: CVData): boolean {
  return !!cvData.skills.certifications.trim();
}

export function hasLanguages(cvData: CVData): boolean {
  return !!cvData.skills.languages.trim();
}
