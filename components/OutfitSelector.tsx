import React from 'react';
import { OutfitOption } from '../types';
import { CheckCircle, Briefcase, User } from 'lucide-react';

interface OutfitSelectorProps {
  options: OutfitOption[];
  onSelect: (option: OutfitOption) => void;
  isProcessing: boolean;
}

const OutfitSelector: React.FC<OutfitSelectorProps> = ({ options, onSelect, isProcessing }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Your Style</h2>
        <p className="text-slate-600">Choose a professional outfit that suits you best.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option)}
            disabled={isProcessing}
            className="group relative flex flex-col items-center bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 hover:border-indigo-400 p-6 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
               {option.id === 'opt1' ? <Briefcase className="w-8 h-8 text-slate-500 group-hover:text-indigo-600" /> : 
                option.id === 'opt2' ? <User className="w-8 h-8 text-slate-500 group-hover:text-indigo-600" /> :
                <Briefcase className="w-8 h-8 text-slate-500 group-hover:text-indigo-600" />}
            </div>
            
            <h3 className="text-lg font-semibold text-slate-900 mb-2 w-full text-center">
              {option.id === 'opt1' ? 'Classic Professional' : 
               option.id === 'opt2' ? 'Modern Smart' : 'Executive Elegance'}
            </h3>
            
            <p className="text-sm text-slate-500 text-center leading-relaxed">
              {option.description}
            </p>

            <div className="mt-6 w-full py-2 px-4 rounded-lg bg-slate-50 text-slate-600 text-sm font-medium text-center group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center gap-2">
              Select Style
              <CheckCircle className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OutfitSelector;