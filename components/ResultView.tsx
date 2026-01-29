import React from 'react';
import { Download, RefreshCw, ArrowRight } from 'lucide-react';

interface ResultViewProps {
  originalImage: string;
  finalImage: string;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ originalImage, finalImage, onReset }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${finalImage}`;
    link.download = 'professional-headshot.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Your Professional Headshot</h2>
        <p className="text-slate-600">Ready for LinkedIn, CVs, and professional profiles.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
        {/* Original */}
        <div className="relative group">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
            Original
          </div>
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-100">
            <img src={originalImage} alt="Original" className="w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 transition-all duration-500" />
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center text-slate-300">
          <ArrowRight className="w-8 h-8" />
        </div>

        {/* Result */}
        <div className="relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-sm">
            Enhanced
          </div>
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-4 border-white shadow-xl ring-4 ring-indigo-50/50 bg-white">
            <img src={`data:image/png;base64,${finalImage}`} alt="Professional Headshot" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-indigo-200/50 transition-all transform hover:-translate-y-0.5 w-full sm:w-auto"
        >
          <Download className="w-5 h-5" />
          Download Photo
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium rounded-xl transition-all w-full sm:w-auto"
        >
          <RefreshCw className="w-5 h-5" />
          Start Over
        </button>
      </div>
    </div>
  );
};

export default ResultView;