import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { ModernTemplate } from '@/components/cv-templates/ModernTemplate';
import { ClassicTemplate } from '@/components/cv-templates/ClassicTemplate';
import {
  Download,
  ArrowLeft,
  Layout,
  Eye,
  Sparkles,
  FileText,
} from 'lucide-react';

export function CVPreview() {
  const { cvData, aiResult, template, setTemplate, setCurrentView } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const getFileName = (): string => {
    const name = cvData.personalInfo.fullName.trim();
    if (!name) return 'my-cv';
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-cv';
  };

  const hasContent = cvData.personalInfo.fullName.trim() || cvData.careerProfile.targetJobTitle.trim();

  if (!hasContent) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">CV Preview</h1>
        <div className="text-center py-16 bg-cream-50 rounded-xl border border-dashed border-navy-200 mt-6">
          <FileText className="w-12 h-12 text-navy-300 mx-auto mb-4" />
          <p className="text-navy-400 text-sm mb-4">No CV content yet. Start by adding your details.</p>
          <Button onClick={() => { setCurrentView('builder'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            Go to CV Builder
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">CV Preview</h1>
        <p className="text-navy-400 text-sm">
          Review your CV below. Switch templates or use AI tools to improve your content.
        </p>
      </div>

      {/* Controls */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-white rounded-xl border border-navy-100 shadow-card">
        {/* Template switcher */}
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-navy-400" />
          <span className="text-sm font-medium text-navy-700 mr-2">Template:</span>
          <div className="flex gap-1 p-1 bg-cream-100 rounded-lg">
            <button
              onClick={() => setTemplate('modern')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                template === 'modern' ? 'bg-white text-teal-700 shadow-soft' : 'text-navy-400 hover:text-navy-700'
              }`}
            >
              Modern
            </button>
            <button
              onClick={() => setTemplate('classic')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                template === 'classic' ? 'bg-white text-teal-700 shadow-soft' : 'text-navy-400 hover:text-navy-700'
              }`}
            >
              Classic
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => { setCurrentView('ai-tools'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <Sparkles className="w-4 h-4" />
            AI Tools
          </Button>
          <Button onClick={handlePrint} className="flex-1 sm:flex-none">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Print instructions */}
      <div className="no-print mb-4 p-3 bg-teal-50 border border-teal-100 rounded-lg">
        <p className="text-xs text-teal-800">
          <strong>How to save as PDF:</strong> Click "Download PDF" and your browser's print dialog will open.
          Choose "Save as PDF" as the destination, then click Save. The file will be named based on your name
          (e.g. <code className="bg-teal-100 px-1 rounded">{getFileName()}.pdf</code>).
        </p>
      </div>

      {/* CV Preview */}
      <div className="bg-white rounded-xl shadow-medium border border-navy-100 overflow-hidden">
        <div id="cv-print-area" className="bg-white">
          {template === 'modern' ? (
            <ModernTemplate cvData={cvData} aiResult={aiResult} />
          ) : (
            <ClassicTemplate cvData={cvData} aiResult={aiResult} />
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="no-print flex items-center justify-between mt-6">
        <Button variant="outline" onClick={() => { setCurrentView('builder'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <ArrowLeft className="w-4 h-4" />
          Back to Builder
        </Button>
        <Button variant="outline" onClick={() => { setCurrentView('ai-tools'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <Eye className="w-4 h-4" />
          AI Tools
        </Button>
      </div>
    </div>
  );
}
