import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { FileText, Sparkles, Download, ShieldCheck, Clock, ArrowRight, CheckCircle2, AlertTriangle, Calculator } from 'lucide-react';
import { useState } from 'react';
import { TimeSavedCalculator } from '@/components/TimeSavedCalculator';

export function LandingPage() {
  const { setCurrentView, setBuilderStep } = useApp();

  const startBuilding = () => {
    setBuilderStep(0);
    setCurrentView('builder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToResponsibleAI = () => {
    setCurrentView('responsible-ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream-50">
        <div className="absolute inset-0 bg-gradient-to-b from-cream-100 to-cream-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered CV Builder
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-900 leading-[1.1] tracking-tight">
              Your experience deserves a better CV.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-navy-500 leading-relaxed max-w-2xl">
              Turn your real experience, education and skills into a professional, job-relevant CV with help from AI.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={startBuilding}>
                Build my CV
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={scrollToHowItWorks}>
                How it works
              </Button>
            </div>
            <p className="mt-6 text-sm text-navy-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              No account needed. Your information stays in your browser.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white border-y border-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-3xl font-bold text-navy-900 text-center mb-4">Three simple steps</h2>
          <p className="text-center text-navy-400 mb-12 max-w-2xl mx-auto">
            From blank page to polished CV — CareerCraft AI guides you through each step.
          </p>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                num: '1',
                icon: FileText,
                title: 'Add your details',
                desc: 'Enter your personal information, work experience, education, and skills through a guided multi-step form.',
              },
              {
                num: '2',
                icon: Sparkles,
                title: 'Improve your content with AI',
                desc: 'Generate a professional summary, improve your experience bullet points, and analyse your CV against a job description.',
              },
              {
                num: '3',
                icon: Download,
                title: 'Preview and download your CV',
                desc: 'Choose between modern and classic templates, see a live preview, and export to PDF for printing or sharing.',
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-5 relative">
                      <Icon className="w-7 h-7 text-teal-600" />
                      <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-navy-900 text-cream-50 text-sm font-bold flex items-center justify-center">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-navy-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-navy-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" onClick={startBuilding}>
              Start building your CV
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-3xl font-bold text-navy-900 text-center mb-4">Real AI, working for you</h2>
          <p className="text-center text-navy-400 mb-12 max-w-2xl mx-auto">
            Three AI-powered tools that use your actual inputs to generate genuine, job-relevant content.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'Professional Summary Generator',
                desc: 'Get a 60–90 word summary tailored to your target role and real background — no clichés, no invented experience.',
              },
              {
                icon: FileText,
                title: 'Experience Bullet Improver',
                desc: 'Transform rough responsibility descriptions into clear, action-oriented CV bullet points that preserve your meaning.',
              },
              {
                icon: CheckCircle2,
                title: 'ATS & Job Description Analyser',
                desc: 'Compare your CV against a job description to find matched keywords, gaps, and actionable recommendations.',
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white rounded-xl p-6 border border-navy-100 shadow-card">
                  <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="font-semibold text-navy-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-navy-500 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Responsible AI highlight */}
      <section className="bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-teal-400 text-sm font-medium mb-4">
                <ShieldCheck className="w-5 h-5" />
                Responsible AI
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-cream-50 mb-4">
                Built with honesty, not hype
              </h2>
              <p className="text-navy-200 leading-relaxed mb-6 max-w-2xl">
                CareerCraft AI is designed to enhance your real experience, not fabricate it. The AI will never invent
                qualifications, metrics, or achievements. You stay in control — review, edit, and accept only what's accurate.
              </p>
              <div className="space-y-3">
                {[
                  'AI-generated content may contain errors — always verify before submitting',
                  'The app will not invent experience or credentials',
                  'ATS analysis is guidance, not a guarantee of interviews',
                  'Your information stays in your browser unless sent to the AI provider',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-navy-200">{point}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button variant="outline" onClick={goToResponsibleAI} className="border-navy-600 text-cream-50 hover:bg-navy-800 hover:border-navy-500">
                  Read full responsible AI principles
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                <div className="flex items-center gap-2 text-cream-50 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span className="font-medium text-sm">Limitations</span>
                </div>
                <ul className="space-y-2.5 text-sm text-navy-200">
                  <li>AI may reflect biases or limitations from its training data.</li>
                  <li>ATS analysis is an approximate keyword comparison, not a real ATS score.</li>
                  <li>AI features require an OpenAI API key to be configured.</li>
                  <li>Always review your CV before sending it to an employer.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Time saved calculator teaser */}
      <section className="bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-teal-700 text-sm font-medium mb-4">
                <Clock className="w-5 h-5" />
                Productivity
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-3">Measure your time saved</h2>
              <p className="text-navy-500 leading-relaxed max-w-xl">
                See how much time CareerCraft AI saves you compared to drafting a CV manually. Enter your estimates
                and get an honest calculation — even if the AI took longer, we'll show that too.
              </p>
            </div>
            <div className="w-full max-w-md">
              <TimeSavedCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white border-t border-navy-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">Ready to craft your CV?</h2>
          <p className="text-navy-400 mb-8 max-w-xl mx-auto">
            Start now — no sign-up required. Your information stays in your browser.
          </p>
          <Button size="lg" onClick={startBuilding}>
            Build my CV
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
