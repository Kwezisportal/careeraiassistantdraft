import { useApp } from '@/context/AppContext';
import type { AppView } from '@/types';
import { FileText, ShieldCheck } from 'lucide-react';

export function Footer() {
  const { setCurrentView } = useApp();

  const navigate = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="no-print bg-navy-900 text-navy-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-cream-50">
              CareerCraft <span className="text-teal-400">AI</span>
            </span>
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <button onClick={() => navigate('home')} className="hover:text-teal-400 transition-colors">
              Home
            </button>
            <button onClick={() => navigate('builder')} className="hover:text-teal-400 transition-colors">
              CV Builder
            </button>
            <button onClick={() => navigate('ai-tools')} className="hover:text-teal-400 transition-colors">
              AI Tools
            </button>
            <button onClick={() => navigate('preview')} className="hover:text-teal-400 transition-colors">
              Preview
            </button>
            <button onClick={() => navigate('responsible-ai')} className="hover:text-teal-400 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Responsible AI
            </button>
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-navy-700 text-center">
          <p className="text-xs text-navy-400">
            CareerCraft AI — AI-Powered Workplace Productivity Assistant for CAPACITI.
            Your information stays in your browser. Always review AI-generated content before submitting to an employer.
          </p>
        </div>
      </div>
    </footer>
  );
}
