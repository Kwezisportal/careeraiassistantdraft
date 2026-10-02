import { useApp } from '@/context/AppContext';
import type { AppView } from '@/types';
import { FileText, Sparkles, Eye, ShieldCheck, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems: { view: AppView; label: string; icon: typeof Home }[] = [
  { view: 'home', label: 'Home', icon: Home },
  { view: 'builder', label: 'CV Builder', icon: FileText },
  { view: 'ai-tools', label: 'AI Tools', icon: Sparkles },
  { view: 'preview', label: 'CV Preview', icon: Eye },
  { view: 'responsible-ai', label: 'Responsible AI', icon: ShieldCheck },
];

export function Navbar() {
  const { currentView, setCurrentView } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (view: AppView) => {
    setCurrentView(view);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="no-print sticky top-0 z-50 bg-cream-50/95 backdrop-blur-sm border-b border-navy-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center transition-transform group-hover:scale-105">
              <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold text-navy-900 tracking-tight">
              CareerCraft <span className="text-teal-600">AI</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => navigate(item.view)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    active
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-navy-500 hover:text-navy-800 hover:bg-cream-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-navy-600 hover:bg-cream-100"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-navy-100 bg-cream-50 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => navigate(item.view)}
                  className={`w-full px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2.5 ${
                    active
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-navy-500 hover:text-navy-800 hover:bg-cream-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
