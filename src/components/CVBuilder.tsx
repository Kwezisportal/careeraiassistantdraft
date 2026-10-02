import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Field, TextInput, TextArea, Select } from '@/components/ui/Field';
import type { CareerLevel, WorkExperience, Education } from '@/types';
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FileSearch,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Sparkles,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';

const STEPS = [
  { label: 'Personal', icon: User },
  { label: 'Career', icon: Briefcase },
  { label: 'Experience', icon: Briefcase },
  { label: 'Education', icon: GraduationCap },
  { label: 'Skills', icon: Wrench },
  { label: 'Job Ad', icon: FileSearch },
  { label: 'Review', icon: CheckCircle },
];

export function CVBuilder() {
  const {
    cvData,
    builderStep,
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
    setCurrentView,
  } = useApp();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!cvData.personalInfo.fullName.trim()) newErrors.fullName = 'Full name is required.';
      if (!cvData.personalInfo.email.trim()) {
        newErrors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cvData.personalInfo.email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (step === 1) {
      if (!cvData.careerProfile.targetJobTitle.trim()) {
        newErrors.targetJobTitle = 'Target job title is required.';
      }
    }

    if (step === 2) {
      cvData.workExperience.forEach((we, i) => {
        if (!we.jobTitle.trim()) newErrors[`we-${i}-jobTitle`] = 'Job title is required.';
        if (!we.employer.trim()) newErrors[`we-${i}-employer`] = 'Employer is required.';
      });
    }

    if (step === 3) {
      cvData.education.forEach((ed, i) => {
        if (!ed.qualification.trim()) newErrors[`ed-${i}-qualification`] = 'Qualification is required.';
        if (!ed.institution.trim()) newErrors[`ed-${i}-institution`] = 'Institution is required.';
      });
    }

    if (step === 4) {
      if (!cvData.skills.relevantSkills.trim()) {
        newErrors.relevantSkills = 'Please list at least a few relevant skills.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validateStep(builderStep)) {
      setBuilderStep(Math.min(builderStep + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const back = () => {
    setErrors({});
    setBuilderStep(Math.max(builderStep - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToAITools = () => {
    setCurrentView('ai-tools');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreview = () => {
    setCurrentView('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">CV Builder</h1>
        <p className="text-navy-400 text-sm">
          Fill in your details step by step. Your information is saved automatically as you go.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const completed = i < builderStep;
            const active = i === builderStep;
            return (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                      completed
                        ? 'bg-teal-600 text-white'
                        : active
                        ? 'bg-navy-900 text-cream-50 ring-4 ring-teal-100'
                        : 'bg-cream-100 text-navy-300 border border-navy-200'
                    }`}
                  >
                    {completed ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <span className={`text-xs hidden sm:block ${active ? 'font-semibold text-navy-900' : completed ? 'text-teal-700' : 'text-navy-300'}`}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-1 sm:mx-2 ${completed ? 'bg-teal-600' : 'bg-navy-100'}`} />
                )}
              </div>
            );
          })}
        </div>
        {/* Mobile current step label */}
        <p className="text-center text-sm font-medium text-navy-700 sm:hidden mt-2">
          Step {builderStep + 1} of {STEPS.length}: {STEPS[builderStep].label}
        </p>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-card p-6 sm:p-8">
        {builderStep === 0 && <StepPersonal errors={errors} />}
        {builderStep === 1 && <StepCareer errors={errors} />}
        {builderStep === 2 && <StepExperience errors={errors} />}
        {builderStep === 3 && <StepEducation errors={errors} />}
        {builderStep === 4 && <StepSkills errors={errors} />}
        {builderStep === 5 && <StepJobDescription />}
        {builderStep === 6 && <StepReview />}
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
        <Button variant="outline" onClick={back} disabled={builderStep === 0} className="w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {builderStep < STEPS.length - 1 ? (
          <Button onClick={next} className="w-full sm:w-auto">
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button variant="secondary" onClick={goToAITools} className="w-full sm:w-auto">
              <Sparkles className="w-4 h-4" />
              Use AI Tools
            </Button>
            <Button onClick={goToPreview} className="w-full sm:w-auto">
              <Eye className="w-4 h-4" />
              Preview CV
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepPersonal({ errors }: { errors: Record<string, string> }) {
  const { cvData, updatePersonalInfo } = useApp();
  const p = cvData.personalInfo;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-navy-900 mb-1">Personal information</h2>
        <p className="text-sm text-navy-400">Start with your basic contact details.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name" required error={errors.fullName}>
          <TextInput
            value={p.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            placeholder="e.g. Thandi Mokoena"
          />
        </Field>
        <Field label="Email address" required error={errors.email} example="e.g. thandi.mokoena@email.com">
          <TextInput
            type="email"
            value={p.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            placeholder="e.g. thandi.mokoena@email.com"
          />
        </Field>
        <Field label="Phone number" optional example="e.g. +27 82 123 4567">
          <TextInput
            value={p.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            placeholder="e.g. +27 82 123 4567"
          />
        </Field>
        <Field label="Location" optional example="e.g. Johannesburg, South Africa">
          <TextInput
            value={p.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            placeholder="e.g. Johannesburg, South Africa"
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="LinkedIn or portfolio URL" optional example="e.g. linkedin.com/in/thandi-mokoena">
            <TextInput
              value={p.linkedinUrl}
              onChange={(e) => updatePersonalInfo('linkedinUrl', e.target.value)}
              placeholder="e.g. linkedin.com/in/thandi-mokoena"
            />
          </Field>
        </div>
      </div>
      <div className="flex items-start gap-2 p-3 bg-teal-50 rounded-lg">
        <AlertCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-teal-800">
          We will never ask for sensitive information such as identity numbers, age, marital status, or health information.
        </p>
      </div>
    </div>
  );
}

function StepCareer({ errors }: { errors: Record<string, string> }) {
  const { cvData, updateCareerProfile } = useApp();
  const c = cvData.careerProfile;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-navy-900 mb-1">Career profile</h2>
        <p className="text-sm text-navy-400">Tell us about the role you're targeting.</p>
      </div>
      <div className="space-y-5">
        <Field label="Target job title" required error={errors.targetJobTitle} example="e.g. Junior Data Analyst">
          <TextInput
            value={c.targetJobTitle}
            onChange={(e) => updateCareerProfile('targetJobTitle', e.target.value)}
            placeholder="e.g. Junior Data Analyst"
          />
        </Field>
        <Field label="Career level" required>
          <Select
            value={c.careerLevel}
            onChange={(e) => updateCareerProfile('careerLevel', e.target.value)}
          >
            <option value="graduate">Graduate — recently completed studies</option>
            <option value="entry-level">Entry-level — some work experience</option>
            <option value="experienced">Experienced professional</option>
            <option value="career-changer">Career changer — transitioning fields</option>
          </Select>
        </Field>
        <Field
          label="Existing professional summary"
          optional
          example="If you already have a summary, paste it here. The AI can improve it, or you can leave this blank and generate one."
        >
          <TextArea
            rows={5}
            value={c.existingSummary}
            onChange={(e) => updateCareerProfile('existingSummary', e.target.value)}
            placeholder="e.g. Recent Information Systems graduate with a passion for data analysis and visualisation..."
          />
        </Field>
      </div>
    </div>
  );
}

function StepExperience({ errors }: { errors: Record<string, string> }) {
  const { cvData, addWorkExperience, updateWorkExperience, removeWorkExperience } = useApp();

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-navy-900 mb-1">Work experience</h2>
          <p className="text-sm text-navy-400">Add your work experience entries. You can improve these with AI later.</p>
        </div>
        <Button size="sm" variant="outline" onClick={addWorkExperience} className="flex-shrink-0">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {cvData.workExperience.length === 0 && (
        <div className="text-center py-12 bg-cream-50 rounded-lg border border-dashed border-navy-200">
          <Briefcase className="w-10 h-10 text-navy-300 mx-auto mb-3" />
          <p className="text-navy-400 text-sm mb-4">No work experience entries yet.</p>
          <Button size="sm" onClick={addWorkExperience}>
            <Plus className="w-4 h-4" />
            Add your first entry
          </Button>
        </div>
      )}

      {cvData.workExperience.map((we, i) => (
        <ExperienceEntry
          key={we.id}
          experience={we}
          index={i}
          errors={errors}
          onUpdate={(field, value) => updateWorkExperience(we.id, field, value)}
          onRemove={() => removeWorkExperience(we.id)}
          canRemove={true}
        />
      ))}
    </div>
  );
}

function ExperienceEntry({
  experience,
  index,
  errors,
  onUpdate,
  onRemove,
  canRemove,
}: {
  experience: WorkExperience;
  index: number;
  errors: Record<string, string>;
  onUpdate: (field: keyof WorkExperience, value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="border border-navy-100 rounded-lg p-5 space-y-4 bg-cream-50/50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-navy-700">Entry {index + 1}</span>
        {canRemove && (
          <button
            onClick={onRemove}
            className="text-navy-400 hover:text-red-600 transition-colors p-1"
            aria-label="Remove entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Job title" required error={errors[`we-${index}-jobTitle`]}>
          <TextInput
            value={experience.jobTitle}
            onChange={(e) => onUpdate('jobTitle', e.target.value)}
            placeholder="e.g. Data Analyst Intern"
          />
        </Field>
        <Field label="Employer" required error={errors[`we-${index}-employer`]}>
          <TextInput
            value={experience.employer}
            onChange={(e) => onUpdate('employer', e.target.value)}
            placeholder="e.g. Standard Bank"
          />
        </Field>
        <Field label="Start date" example="e.g. January 2024">
          <TextInput
            value={experience.startDate}
            onChange={(e) => onUpdate('startDate', e.target.value)}
            placeholder="e.g. January 2024"
          />
        </Field>
        <Field label="End date" optional example="e.g. June 2024, or 'Present'">
          <TextInput
            value={experience.endDate}
            onChange={(e) => onUpdate('endDate', e.target.value)}
            placeholder="e.g. June 2024, or 'Present'"
          />
        </Field>
      </div>
      <Field
        label="Responsibilities"
        optional
        example="Describe what you did day-to-day. You can improve these with AI later."
      >
        <TextArea
          rows={4}
          value={experience.responsibilities}
          onChange={(e) => onUpdate('responsibilities', e.target.value)}
          placeholder="e.g. Analysed customer transaction data using SQL and Excel. Created weekly dashboards for the management team."
        />
      </Field>
      <Field label="Achievements" optional example="e.g. Received intern of the month award">
        <TextArea
          rows={2}
          value={experience.achievements}
          onChange={(e) => onUpdate('achievements', e.target.value)}
          placeholder="e.g. Received intern of the month award for outstanding dashboard work."
        />
      </Field>
    </div>
  );
}

function StepEducation({ errors }: { errors: Record<string, string> }) {
  const { cvData, addEducation, updateEducation, removeEducation } = useApp();

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-navy-900 mb-1">Education</h2>
          <p className="text-sm text-navy-400">Add your qualifications and educational background.</p>
        </div>
        <Button size="sm" variant="outline" onClick={addEducation} className="flex-shrink-0">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {cvData.education.length === 0 && (
        <div className="text-center py-12 bg-cream-50 rounded-lg border border-dashed border-navy-200">
          <GraduationCap className="w-10 h-10 text-navy-300 mx-auto mb-3" />
          <p className="text-navy-400 text-sm mb-4">No education entries yet.</p>
          <Button size="sm" onClick={addEducation}>
            <Plus className="w-4 h-4" />
            Add your first qualification
          </Button>
        </div>
      )}

      {cvData.education.map((ed, i) => (
        <EducationEntry
          key={ed.id}
          education={ed}
          index={i}
          errors={errors}
          onUpdate={(field, value) => updateEducation(ed.id, field, value)}
          onRemove={() => removeEducation(ed.id)}
        />
      ))}
    </div>
  );
}

function EducationEntry({
  education,
  index,
  errors,
  onUpdate,
  onRemove,
}: {
  education: Education;
  index: number;
  errors: Record<string, string>;
  onUpdate: (field: keyof Education, value: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="border border-navy-100 rounded-lg p-5 space-y-4 bg-cream-50/50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-navy-700">Entry {index + 1}</span>
        <button
          onClick={onRemove}
          className="text-navy-400 hover:text-red-600 transition-colors p-1"
          aria-label="Remove entry"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Qualification" required error={errors[`ed-${index}-qualification`]}>
          <TextInput
            value={education.qualification}
            onChange={(e) => onUpdate('qualification', e.target.value)}
            placeholder="e.g. BSc Information Systems"
          />
        </Field>
        <Field label="Institution" required error={errors[`ed-${index}-institution`]}>
          <TextInput
            value={education.institution}
            onChange={(e) => onUpdate('institution', e.target.value)}
            placeholder="e.g. University of the Witwatersrand"
          />
        </Field>
        <Field label="Dates" example="e.g. 2021 – 2023">
          <TextInput
            value={education.dates}
            onChange={(e) => onUpdate('dates', e.target.value)}
            placeholder="e.g. 2021 – 2023"
          />
        </Field>
      </div>
      <Field label="Relevant coursework or academic achievements" optional>
        <TextArea
          rows={2}
          value={education.coursework}
          onChange={(e) => onUpdate('coursework', e.target.value)}
          placeholder="e.g. Data Structures, Database Management, Business Intelligence. Dean's List 2022."
        />
      </Field>
    </div>
  );
}

function StepSkills({ errors }: { errors: Record<string, string> }) {
  const { cvData, updateSkills } = useApp();
  const s = cvData.skills;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-navy-900 mb-1">Skills, certifications & languages</h2>
        <p className="text-sm text-navy-400">List your relevant skills. Use commas to separate them.</p>
      </div>
      <Field
        label="Relevant skills"
        required
        error={errors.relevantSkills}
        example="e.g. SQL, Python, Excel, Tableau, Data Analysis, Communication"
      >
        <TextArea
          rows={3}
          value={s.relevantSkills}
          onChange={(e) => updateSkills('relevantSkills', e.target.value)}
          placeholder="e.g. SQL, Python, Excel, Tableau, Data Analysis, Communication"
        />
      </Field>
      <Field label="Certifications" optional example="e.g. Google Data Analytics Certificate, AWS Cloud Practitioner">
        <TextArea
          rows={2}
          value={s.certifications}
          onChange={(e) => updateSkills('certifications', e.target.value)}
          placeholder="e.g. Google Data Analytics Certificate, AWS Cloud Practitioner"
        />
      </Field>
      <Field label="Languages" optional example="e.g. English (native), isiZulu (intermediate), French (basic)">
        <TextInput
          value={s.languages}
          onChange={(e) => updateSkills('languages', e.target.value)}
          placeholder="e.g. English (native), isiZulu (intermediate)"
        />
      </Field>
    </div>
  );
}

function StepJobDescription() {
  const { cvData, updateJobDescription } = useApp();

  return (
    <div className="space-y-5">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cream-100 text-navy-500 rounded-full text-xs font-medium mb-3">
          Optional
        </div>
        <h2 className="text-xl font-semibold text-navy-900 mb-1">Target job description</h2>
        <p className="text-sm text-navy-400">
          Paste the job advert you're applying for. This helps the AI tailor your summary, bullet points, and
          provide an ATS-style analysis.
        </p>
      </div>
      <Field
        label="Job advert text"
        optional
        example="Paste the full job description here. The AI will use it only for keyword alignment and analysis."
      >
        <TextArea
          rows={12}
          value={cvData.jobDescription}
          onChange={(e) => updateJobDescription(e.target.value)}
          placeholder="Paste the job advert here..."
          className="font-mono text-xs"
        />
      </Field>
      <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          The job description is treated as untrusted data. It will be analysed for keywords, never treated as
          instructions that can override the application's safety rules.
        </p>
      </div>
    </div>
  );
}

function StepReview() {
  const { cvData, aiResult, setBuilderStep, setCurrentView } = useApp();

  const hasPersonal = cvData.personalInfo.fullName.trim() && cvData.personalInfo.email.trim();
  const hasCareer = cvData.careerProfile.targetJobTitle.trim();
  const hasExperience = cvData.workExperience.length > 0;
  const hasEducation = cvData.education.length > 0;
  const hasSkills = cvData.skills.relevantSkills.trim();
  const hasJobDesc = cvData.jobDescription.trim();
  const hasAISummary = aiResult.summary.trim();

  const sections = [
    { label: 'Personal information', done: !!hasPersonal, step: 0 },
    { label: 'Career profile', done: !!hasCareer, step: 1 },
    { label: 'Work experience', done: hasExperience, step: 2, count: cvData.workExperience.length },
    { label: 'Education', done: hasEducation, step: 3, count: cvData.education.length },
    { label: 'Skills', done: !!hasSkills, step: 4 },
    { label: 'Job description', done: !!hasJobDesc, step: 5, optional: true },
    { label: 'AI professional summary', done: hasAISummary, isAI: true },
  ];

  const goToStep = (step: number) => {
    setBuilderStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToAITools = () => {
    setCurrentView('ai-tools');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-navy-900 mb-1">Review your information</h2>
        <p className="text-sm text-navy-400">
          Check that everything looks complete. Click any section to edit it, or use the AI tools to improve your content.
        </p>
      </div>

      <div className="space-y-2">
        {sections.map((section, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
              section.done
                ? 'border-teal-100 bg-teal-50/50'
                : section.optional
                ? 'border-navy-100 bg-cream-50'
                : 'border-amber-100 bg-amber-50/50'
            }`}
          >
            <div className="flex items-center gap-3">
              {section.done ? (
                <CheckCircle className="w-5 h-5 text-teal-600" />
              ) : section.optional ? (
                <div className="w-5 h-5 rounded-full border-2 border-navy-200" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500" />
              )}
              <div>
                <span className="text-sm font-medium text-navy-800">{section.label}</span>
                {section.count !== undefined && section.count > 0 && (
                  <span className="text-xs text-navy-400 ml-2">({section.count} {section.count === 1 ? 'entry' : 'entries'})</span>
                )}
                {section.optional && !section.done && (
                  <span className="text-xs text-navy-400 ml-2">— optional</span>
                )}
              </div>
            </div>
            {!section.isAI ? (
              <button
                onClick={() => goToStep(section.step)}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={goToAITools}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Generate
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-navy-100">
        <Button variant="secondary" onClick={goToAITools} className="flex-1">
          <Sparkles className="w-4 h-4" />
          Use AI Tools to improve content
        </Button>
        <Button onClick={() => { setCurrentView('preview'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex-1">
          <Eye className="w-4 h-4" />
          Preview CV
        </Button>
      </div>
    </div>
  );
}
