import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LandingPage } from '@/components/LandingPage';
import { CVBuilder } from '@/components/CVBuilder';
import { AITools } from '@/components/AITools';
import { CVPreview } from '@/components/CVPreview';
import { ResponsibleAI } from '@/components/ResponsibleAI';

function AppContent() {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navbar />
      <main className="flex-1">
        {currentView === 'home' && <LandingPage />}
        {currentView === 'builder' && <CVBuilder />}
        {currentView === 'ai-tools' && <AITools />}
        {currentView === 'preview' && <CVPreview />}
        {currentView === 'responsible-ai' && <ResponsibleAI />}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
