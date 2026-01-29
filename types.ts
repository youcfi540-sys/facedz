export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING', // Analyzing face/gender
  GENERATING_OPTIONS = 'GENERATING_OPTIONS', // Generating female options
  SELECTING = 'SELECTING', // User selecting outfit (Female only)
  PROCESSING = 'PROCESSING', // Final high-res generation
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNKNOWN = 'UNKNOWN'
}

export interface AnalysisResult {
  valid: boolean;
  gender: Gender;
  message?: string;
}

export interface OutfitOption {
  id: string;
  description: string;
  imageUrl?: string; // Preview image
  promptFragment: string;
}

export interface ImageState {
  original: string | null; // Base64
  final: string | null; // Base64
  mimeType: string;
}