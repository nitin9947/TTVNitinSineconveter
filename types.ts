export type Language = 'en' | 'hi' | 'gu';
export type SignSystem = 'ISL' | 'ASL' | 'BSL';

export type AppView =
  | 'sign-to-speech'
  | 'voice-to-sign'
  | 'multilang'
  | 'subtitles'
  | 'videocall'
  | 'emergency'
  | 'ai-learning'
  | 'analytics'
  | 'mobile-export';

export interface KeyframePose {
  leftArm?: { shoulder?: [number, number, number]; elbow?: [number, number, number]; wrist?: [number, number, number] };
  rightArm?: { shoulder?: [number, number, number]; elbow?: [number, number, number]; wrist?: [number, number, number] };
  leftHandFingers?: number[]; // 5 finger flex values 0 (open) to 1 (closed)
  rightHandFingers?: number[];
  head?: [number, number, number];
  durationMs?: number;
}

export interface SignGesture {
  id: string;
  name: string;
  category: 'greetings' | 'questions' | 'essentials' | 'emergency' | 'numbers' | 'alphabet' | 'custom';
  signSystem: SignSystem;
  description: string;
  hindiText?: string;
  gujaratiText?: string;
  keyframes: KeyframePose[];
  svgIcon?: string;
  tags?: string[];
}

export interface SubtitleItem {
  id: string;
  timestamp: string;
  speaker: string;
  text: string;
  translatedText?: string;
  signSequence?: string[];
  confidence: number;
  language: Language;
}

export interface SubtitleStyle {
  textColor: 'white' | 'yellow' | 'cyan' | 'green';
  bgColor: 'black' | 'transparent' | 'dark-blue' | 'glass';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  showSignIcons: boolean;
}

export type EmergencyType = 'hospital' | 'police' | 'ambulance' | 'fire' | 'family' | 'sos';

export interface EmergencyRecord {
  id: string;
  timestamp: string;
  type: EmergencyType;
  title: string;
  message: string;
  language: Language;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  synced: boolean;
}

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface CustomSign {
  id: string;
  name: string;
  signSystem: SignSystem;
  category: string;
  landmarks: HandLandmark[];
  recordedAt: string;
  version: number;
  confidence: number;
  notes?: string;
}

export interface AiVisionMetrics {
  emotion: 'smile' | 'sad' | 'angry' | 'surprised' | 'neutral';
  fatigueScore: number; // 0 to 100
  attentionScore: number; // 0 to 100
  handInFrame: boolean;
  lightingQuality: 'good' | 'dim' | 'overexposed';
  gestureQualityScore: number; // 0 to 100
}

export interface VideoCallState {
  isCallActive: boolean;
  isCameraOn: boolean;
  isMicOn: boolean;
  isScreenSharing: boolean;
  isPiP: boolean;
  noiseSuppression: boolean;
  echoCancellation: boolean;
  lowBandwidth: boolean;
  dualSubtitles: boolean;
  signDetection: boolean;
  remoteParticipantName: string;
}

export interface UsageAnalytics {
  dailyCount: number;
  weeklyCount: number;
  monthlyCount: number;
  recognitionAccuracy: number;
  translationAccuracy: number;
  mostUsedSigns: { name: string; count: number }[];
  languageStats: { language: string; percentage: number }[];
  avgResponseTimeMs: number;
  modelPerformance: { fps: number; latencyMs: number; memoryMb: number };
}
