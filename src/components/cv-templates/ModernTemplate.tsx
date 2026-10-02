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
import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';

export function ModernTemplate({ cvData, aiResult }: { cvData: CVData; aiResult: AIResult }) {
  const p = cvData.personalInfo;
  const summary = getSummary(cvData, aiResult);
  const skills = parseList(cvData.skills.relevantSkills);
  const certifications = parseList(cvData.skills.certifications);
  const languages = parseList(cvData.skills.languages);

  return (
    <div className="cv-template p-8 sm:p-12 text-navy-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight">
          {p.fullName || 'Your Name'}
        </h1>
        {cvData.careerProfile.targetJobTitle && (
          <p className="text-teal-600 font-medium mt-1 text-lg">{cvData.careerProfile.targetJobTitle}</p>
        )}
        {hasContactInfo(p) && (
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4 text-sm text-navy-500">
            {p.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                {p.email}
              </span>
            )}
            {p.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                {p.phone}
              </span>
            )}
            {p.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                {p.location}
              </span>
            )}
            {p.linkedinUrl && (
              <span className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-teal-600" />
                {p.linkedinUrl}
              </span>
            )}
          </div>
        )}
        <div className="mt-4 h-0.5 bg-teal-600" />
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="mb-8 break-inside-avoid">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-600 mb-3 border-b border-navy-100 pb-2">
            Professional Summary
          </h2>
          <p className="text-sm text-navy-700 leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {hasExperience(cvData) && (
        <section className="mb-8 break-inside-avoid">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-600 mb-4 border-b border-navy-100 pb-2">
            Work Experience
          </h2>
          <div className="space-y-6">
            {cvData.workExperience.map((we) => {
              if (!we.jobTitle.trim() && !we.employer.trim() && !we.responsibilities.trim()) return null;
              const bullets = getExperienceBullets(we, aiResult);
              const dateRange = formatDateRange(we.startDate, we.endDate);
              return (
                <div key={we.id} className="break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                    <h3 className="font-semibold text-navy-900 text-base">
                      {we.jobTitle || 'Untitled Role'}
                      {we.employer && <span className="text-navy-500 font-normal"> — {we.employer}</span>}
                    </h3>
                    {dateRange && <span className="text-sm text-navy-400 flex-shrink-0">{dateRange}</span>}
                  </div>
                  {bullets.length > 0 && (
                    <ul className="space-y-1.5 ml-4">
                      {bullets.map((bullet, i) => (
                        <li key={i} className="text-sm text-navy-700 leading-relaxed flex gap-2">
                          <span className="text-teal-600 flex-shrink-0">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {we.achievements.trim() && (
                    <p className="text-sm text-navy-600 mt-2 italic">
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
        <section className="mb-8 break-inside-avoid">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-600 mb-4 border-b border-navy-100 pb-2">
            Education
          </h2>
          <div className="space-y-4">
            {cvData.education.map((ed) => {
              if (!ed.qualification.trim() && !ed.institution.trim()) return null;
              return (
                <div key={ed.id} className="break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <h3 className="font-semibold text-navy-900 text-base">
                      {ed.qualification || 'Qualification'}
                      {ed.institution && <span className="text-navy-500 font-normal"> — {ed.institution}</span>}
                    </h3>
                    {ed.dates && <span className="text-sm text-navy-400 flex-shrink-0">{ed.dates}</span>}
                  </div>
                  {ed.coursework.trim() && (
                    <p className="text-sm text-navy-600 mt-1">{ed.coursework}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Skills */}
      {hasSkills(cvData) && (
        <section className="mb-8 break-inside-avoid">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-600 mb-3 border-b border-navy-100 pb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 text-sm bg-teal-50 text-teal-700 rounded-md border border-teal-100">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {hasCertifications(cvData) && (
        <section className="mb-8 break-inside-avoid">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-600 mb-3 border-b border-navy-100 pb-2">
            Certifications
          </h2>
          <ul className="space-y-1.5 ml-4">
            {certifications.map((cert, i) => (
              <li key={i} className="text-sm text-navy-700 leading-relaxed flex gap-2">
                <span className="text-teal-600 flex-shrink-0">•</span>
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages */}
      {hasLanguages(cvData) && (
        <section className="break-inside-avoid">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-600 mb-3 border-b border-navy-100 pb-2">
            Languages
          </h2>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5">
            {languages.map((lang, i) => (
              <span key={i} className="text-sm text-navy-700">{lang}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
