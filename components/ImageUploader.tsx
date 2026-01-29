import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  isProcessing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file (JPG, PNG).");
      return;
    }
    
    // Max size check (e.g., 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size too large. Please upload an image under 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract base64 and mime type
      const [header, base64] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
      onImageSelected(base64, mimeType);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ease-in-out text-center cursor-pointer ${
          dragActive 
            ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
            : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/png, image/jpeg, image/webp"
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full ${dragActive ? 'bg-indigo-100' : 'bg-slate-100'} transition-colors`}>
            {dragActive ? (
              <Upload className="w-8 h-8 text-indigo-600" />
            ) : (
              <ImageIcon className="w-8 h-8 text-slate-500" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-900">
              {dragActive ? "Drop image here" : "Upload your selfie"}
            </h3>
            <p className="text-sm text-slate-500">
              Drag & drop or click to browse
            </p>
          </div>
          <p className="text-xs text-slate-400 max-w-[200px]">
            Supported formats: JPG, PNG. Max file size: 10MB
          </p>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;