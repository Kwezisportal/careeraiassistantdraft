import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Lock,
  Eye,
  FileWarning,
  Scale,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { useState } from 'react';
import { TimeSavedCalculator } from '@/components/TimeSavedCalculator';

export function ResponsibleAI() {
  const { clearAllData, setCurrentView } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClear = () => {
    clearAllData();
    setShowConfirm(false);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-medium mb-4">
          <ShieldCheck className="w-4 h-4" />
          Responsible AI
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-3">
          How CareerCraft AI uses AI responsibly
        </h1>
        <p className="text-navy-500 leading-relaxed">
          CareerCraft AI is designed to enhance your real experience, not fabricate it. Here's what you need to know
          about how the AI works, its limitations, and your privacy.
        </p>
      </div>

      {/* Principles */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {[
          {
            icon: AlertTriangle,
            title: 'AI content may contain errors',
            desc: 'AI-generated summaries, bullet points, and analysis can contain mistakes. Always verify qualifications, employment dates, skills, and achievements before submitting your CV.',
          },
          {
            icon: FileWarning,
            title: 'No invented experience',
            desc: 'The AI is instructed never to invent qualifications, metrics, responsibilities, or achievements. Where evidence is missing, it asks for more information rather than fabricating it.',
          },
          {
            icon: Scale,
            title: 'ATS analysis is guidance, not a guarantee',
            desc: 'The job description analysis is an approximate, transparent keyword comparison. It does not reproduce any proprietary ATS scoring system and cannot guarantee your CV will pass screening.',
          },
          {
            icon: Eye,
            title: 'AI may reflect biases',
            desc: 'AI models can reflect biases or limitations from their training data. Review all generated content critically and edit anything that does not accurately represent you.',
          },
          {
            icon: CheckCircle2,
            title: 'You stay in control',
            desc: 'All AI-generated content is editable. You choose what to accept into your CV. Nothing is applied automatically — review, edit, and accept only what is accurate.',
          },
          {
            icon: Lock,
            title: 'Your data privacy',
            desc: 'Your information is stored in your browser only. When you use AI features, your CV data is sent to the configured AI provider to fulfil your request and may be handled under that provider\'s applicable terms.',
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-white rounded-xl p-5 border border-navy-100 shadow-card">
              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="font-semibold text-navy-900 mb-1.5 text-sm">{item.title}</h3>
              <p className="text-sm text-navy-500 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Important note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-1">Always review before submitting</h3>
            <p className="text-sm text-amber-800 leading-relaxed">
              You should always review your CV before submitting it to an employer. CareerCraft AI is a tool to help
              you draft and improve content — you are responsible for the accuracy of everything in your final CV.
            </p>
          </div>
        </div>
      </div>

      {/* Data handling */}
      <div className="bg-white rounded-xl border border-navy-100 shadow-card p-6 mb-8">
        <h3 className="font-semibold text-navy-900 mb-3 flex items-center gap-2">
          <Lock className="w-5 h-5 text-teal-600" />
          How your information is handled
        </h3>
        <ul className="space-y-2.5 text-sm text-navy-600">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            Your CV information is stored locally in your browser. It is not saved to a database by default.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            When you use an AI feature, the relevant parts of your CV data are sent securely to the AI provider to
            generate your requested content.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            We do not claim that your information is "never stored" — once sent to the AI provider, it may be handled
            under that provider's applicable terms and conditions.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            We do not log personal CV content unnecessarily.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            You can clear all your information at any time using the button below.
          </li>
        </ul>
      </div>

      {/* Time saved calculator */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-teal-600" />
          <h3 className="font-semibold text-navy-900">Measure your time saved</h3>
        </div>
        <TimeSavedCalculator />
      </div>

      {/* Clear data */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-600" />
          Clear my information
        </h3>
        <p className="text-sm text-red-700 leading-relaxed mb-4">
          This will permanently delete all your form data, AI-generated content, and preview from your browser.
          This action cannot be undone.
        </p>
        {!showConfirm ? (
          <Button variant="danger" onClick={() => setShowConfirm(true)}>
            <Trash2 className="w-4 h-4" />
            Clear my information
          </Button>
        ) : (
          <div className="bg-white rounded-lg p-4 border border-red-200 animate-fade-in">
            <p className="text-sm font-medium text-red-900 mb-3">
              Are you sure? This will permanently delete all your data.
            </p>
            <div className="flex gap-2">
              <Button variant="danger" size="sm" onClick={handleClear}>
                Yes, clear everything
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Back navigation */}
      <div className="mt-8">
        <Button variant="outline" onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
