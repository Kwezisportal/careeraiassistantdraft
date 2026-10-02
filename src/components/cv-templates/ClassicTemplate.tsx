import type { CVData, AIResult } from '@/types';
import {
  getSummary,
  getExperienceBullets,
  formatDateRange,
  parseList,
  hasContactInfo,
  hasExperience,
  hasEducation,
  hasSkills,
  hasCertifications,
  hasLanguages,
} from './cv-utils';

export function ClassicTemplate({ cvData, aiResult }: { cvData: CVData; aiResult: AIResult }) {
  const p = cvData.personalInfo;
  const summary = getSummary(cvData, aiResult);
  const skills = parseList(cvData.skills.relevantSkills);
  const certifications = parseList(cvData.skills.certifications);
  const languages = parseList(cvData.skills.languages);

  const SectionTitle = ({ children }: { children: string }) => (
    <h2 className="text-base font-bold text-navy-900 mb-2 uppercase tracking-wide border-b-2 border-navy-900 pb-1">
      {children}
    </h2>
  );

  return (
    <div className="cv-template p-8 sm:p-12 text-navy-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-wide">
          {p.fullName || 'Your Name'}
        </h1>
        {cvData.careerProfile.targetJobTitle && (
          <p className="text-navy-600 mt-1 text-lg italic">{cvData.careerProfile.targetJobTitle}</p>
        )}
        {hasContactInfo(p) && (
          <p className="text-sm text-navy-500 mt-3">
            {[
              p.email,
              p.phone,
              p.location,
              p.linkedinUrl,
            ].filter(Boolean).join(' | ')}
          </p>
        )}
        <div className="mt-4 border-t border-navy-300" />
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="mb-6 break-inside-avoid">
          <SectionTitle>Professional Summary</SectionTitle>
          <p className="text-sm text-navy-700 leading-relaxed text-justify">{summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {hasExperience(cvData) && (
        <section className="mb-6 break-inside-avoid">
          <SectionTitle>Work Experience</SectionTitle>
          <div className="space-y-5">
            {cvData.workExperience.map((we) => {
              if (!we.jobTitle.trim() && !we.employer.trim() && !we.responsibilities.trim()) return null;
              const bullets = getExperienceBullets(we, aiResult);
              const dateRange = formatDateRange(we.startDate, we.endDate);
              return (
                <div key={we.id} className="break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 mb-1">
                    <h3 className="font-bold text-navy-900 text-base">
                      {we.jobTitle || 'Untitled Role'}
                      {we.employer && <span className="font-normal text-navy-600">, {we.employer}</span>}
                    </h3>
                    {dateRange && <span className="text-sm text-navy-500 italic flex-shrink-0">{dateRange}</span>}
                  </div>
                  {bullets.length > 0 && (
                    <ul className="space-y-1 ml-5 list-disc">
                      {bullets.map((bullet, i) => (
                        <li key={i} className="text-sm text-navy-700 leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                  {we.achievements.trim() && (
                    <p className="text-sm text-navy-600 mt-1.5 italic">
                      <strong className="not-italic text-navy-700">Achievements: </strong>
                      {we.achievements}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Education */}
      {hasEducation(cvData) && (
        <section className="mb-6 break-inside-avoid">
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-3">
            {cvData.education.map((ed) => {
              if (!ed.qualification.trim() && !ed.institution.trim()) return null;
              return (
                <div key={ed.id} className="break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                    <h3 className="font-bold text-navy-900 text-base">
                      {ed.qualification || 'Qualification'}
                      {ed.institution && <span className="font-normal text-navy-600">, {ed.institution}</span>}
                    </h3>
                    {ed.dates && <span className="text-sm text-navy-500 italic flex-shrink-0">{ed.dates}</span>}
                  </div>
                  {ed.coursework.trim() && (
                    <p className="text-sm text-navy-600 mt-0.5">{ed.coursework}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Skills */}
      {hasSkills(cvData) && (
        <section className="mb-6 break-inside-avoid">
          <SectionTitle>Skills</SectionTitle>
          <p className="text-sm text-navy-700 leading-relaxed">{skills.join(', ')}</p>
        </section>
      )}

      {/* Certifications */}
      {hasCertifications(cvData) && (
        <section className="mb-6 break-inside-avoid">
          <SectionTitle>Certifications</SectionTitle>
          <ul className="space-y-1 ml-5 list-disc">
            {certifications.map((cert, i) => (
              <li key={i} className="text-sm text-navy-700 leading-relaxed">{cert}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages */}
      {hasLanguages(cvData) && (
        <section className="break-inside-avoid">
          <SectionTitle>Languages</SectionTitle>
          <p className="text-sm text-navy-700 leading-relaxed">{languages.join(', ')}</p>
        </section>
      )}
    </div>
  );
}
