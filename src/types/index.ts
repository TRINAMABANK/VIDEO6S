export interface UploadedMedia {
  file: File | null;
  previewUrl: string | null;
  name: string;
  size: number;
  type: string;
}

export type ProcessStepStatus = 'idle' | 'running' | 'completed' | 'error';

export interface ProcessStep {
  id: number;
  label: string;
  description?: string;
  status: ProcessStepStatus;
  duration?: number;
  timestamp?: string;
}

export interface StoryboardScene {
  id: string;
  timeRange: string;
  durationSeconds: number;
  title: string;
  description: string;
  visualPrompt: string;
  audioPrompt: string;
  cameraMovement: string;
  sceneType: 'hook' | 'intro' | 'kol_interaction' | 'highlights' | 'cta';
  badgeColor: string;
  thumbnailPlaceholder?: string;
}

export interface DriveItem {
  name: string;
  size: string;
  type: 'image' | 'json' | 'video' | 'text' | 'folder';
  updatedAt: string;
  status: 'synced' | 'ready' | 'pending';
  icon: string;
  previewUrl?: string;
  description?: string;
}

export interface GenerationJob {
  jobId: string;
  createdAt: Date;
  status: 'idle' | 'received' | 'processing' | 'completed' | 'failed';
  currentStepIndex: number;
  bookImage: UploadedMedia | null;
  kolImage: UploadedMedia | null;
  storyboard: StoryboardScene[];
  driveFiles: DriveItem[];
  caption: string;
  hashtags: string[];
  videoUrl?: string;
  executionLogs: string[];
}

export interface AppSettings {
  n8nWebhookUrl: string;
  n8nApiKey: string;
  googleDriveRootFolder: string;
  videoQuality: '1080p' | '4k' | '720p';
  aiModelText: string;
  aiModelVideo: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  autoDownload: boolean;
  useN8nWebhook: boolean;
}

export interface N8nResponse {
  success: boolean;
  job_id?: string;
  status?: string;
  message?: string;
  [key: string]: unknown;
}
