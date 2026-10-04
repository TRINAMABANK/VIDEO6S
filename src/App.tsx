import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { ProcessWorkflow } from './components/layout/ProcessWorkflow';
import { UploadSection } from './components/upload/UploadSection';
import { ProgressTracker } from './components/progress/ProgressTracker';
import { PreviewSection } from './components/preview/PreviewSection';
import { DriveFolderViewer } from './components/drive/DriveFolderViewer';
import { CaptionCard } from './components/caption/CaptionCard';
import { Footer } from './components/layout/Footer';
import { HistoryModal } from './components/history/HistoryModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { DriveModal } from './components/drive/DriveModal';

import type { UploadedMedia, ProcessStep, StoryboardScene, DriveItem, GenerationJob, AppSettings, N8nWebhookResponse } from './types';
import { INITIAL_PROCESS_STEPS, DEFAULT_STORYBOARD, DEFAULT_DRIVE_FILES, SAMPLE_CAPTION, DEFAULT_SETTINGS } from './constants/mockData';
import { VideoFactoryService } from './services/videoFactoryService';
import { triggerCelebration } from './utils/helpers';
import { CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation & Modals
  const [activeNavTab, setActiveNavTab] = useState<'create' | 'history' | 'drive' | 'settings'>('create');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Upload States
  const [bookMedia, setBookMedia] = useState<UploadedMedia | null>(null);
  const [kolMedia, setKolMedia] = useState<UploadedMedia | null>(null);

  // Generation Execution States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(INITIAL_PROCESS_STEPS);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [currentJobId, setCurrentJobId] = useState('JOB-0001');
  const [n8nJobResponse, setN8nJobResponse] = useState<N8nWebhookResponse | null>(null);

  // Result States
  const [storyboard, setStoryboard] = useState<StoryboardScene[]>(DEFAULT_STORYBOARD);
  const [driveFiles, setDriveFiles] = useState<DriveItem[]>(DEFAULT_DRIVE_FILES);
  const [captionText, setCaptionText] = useState(
    `${SAMPLE_CAPTION.title}\n\n${SAMPLE_CAPTION.body}\n\n${SAMPLE_CAPTION.cta}`
  );
  const [hashtags, setHashtags] = useState<string[]>(SAMPLE_CAPTION.hashtags);

  // History Jobs
  const [historyJobs, setHistoryJobs] = useState<GenerationJob[]>([]);

  // Navigation handler
  const handleTabChange = (tab: 'create' | 'history' | 'drive' | 'settings') => {
    setActiveNavTab(tab);
    if (tab === 'history') setIsHistoryOpen(true);
    if (tab === 'drive') setIsDriveModalOpen(true);
    if (tab === 'settings') setIsSettingsOpen(true);
  };

  // Reset entire state
  const handleReset = () => {
    setBookMedia(null);
    setKolMedia(null);
    setIsProcessing(false);
    setIsCompleted(false);
    setCurrentStepIndex(0);
    setN8nJobResponse(null);
    setProcessSteps(INITIAL_PROCESS_STEPS.map(s => ({ ...s, status: 'idle' })));
    setExecutionLogs([]);
  };

  // Main Action: Upload BOOK + KOL -> N8N WEBHOOK -> Nhận 2 file -> Trả JOB_ID -> Frontend: "Đã nhận yêu cầu"
  const handleStartGenerate = async () => {
    if (!bookMedia || !kolMedia || isProcessing) return;

    setIsProcessing(true);
    setIsCompleted(false);
    setN8nJobResponse(null);
    setCurrentStepIndex(0);
    setExecutionLogs([
      `[${new Date().toLocaleTimeString()}] 🚀 [ANTIGRAVITY] Bắt đầu phiên làm việc: Gửi Sách & KOL tới N8N WEBHOOK...`
    ]);

    const cleanSteps = INITIAL_PROCESS_STEPS.map(s => ({ ...s, status: 'idle' as const }));
    setProcessSteps(cleanSteps);

    try {
      await VideoFactoryService.executePipeline(
        bookMedia,
        kolMedia,
        settings.n8nWebhookUrl,
        settings.useN8nWebhook,
        {
          onStepUpdate: (updatedSteps, activeIdx, log) => {
            setProcessSteps(updatedSteps);
            setCurrentStepIndex(activeIdx);
            setExecutionLogs(prev => [log, ...prev]);
          },
          onJobReceived: (jobRes) => {
            setN8nJobResponse(jobRes);
            setCurrentJobId(jobRes.job_id);
          },
          onComplete: (result) => {
            setIsProcessing(false);
            setIsCompleted(true);
            setCurrentJobId(result.jobId);
            setStoryboard(result.storyboard);
            setDriveFiles(result.driveFiles);
            setCaptionText(result.caption);
            setHashtags(result.hashtags);

            triggerCelebration();

            const newJob: GenerationJob = {
              jobId: result.jobId,
              createdAt: result.completedAt,
              status: 'completed',
              currentStepIndex: 7,
              bookImage: bookMedia,
              kolImage: kolMedia,
              storyboard: result.storyboard,
              driveFiles: result.driveFiles,
              caption: result.caption,
              hashtags: result.hashtags,
              executionLogs
            };

            setHistoryJobs(prev => [newJob, ...prev]);
          },
          onError: (errMsg) => {
            setIsProcessing(false);
            alert(`Lỗi Webhook: ${errMsg}`);
          }
        }
      );
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleSelectJobFromHistory = (job: GenerationJob) => {
    setCurrentJobId(job.jobId);
    setBookMedia(job.bookImage);
    setKolMedia(job.kolImage);
    setStoryboard(job.storyboard);
    setDriveFiles(job.driveFiles);
    setCaptionText(job.caption);
    setHashtags(job.hashtags);
    setIsCompleted(true);
    setProcessSteps(INITIAL_PROCESS_STEPS.map(s => ({ ...s, status: 'completed' })));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* 1. Header */}
      <Header
        activeTab={activeNavTab}
        onTabChange={handleTabChange}
        historyCount={historyJobs.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* 2. Process Workflow (6 Steps Overview) */}
        <ProcessWorkflow
          currentStepIndex={currentStepIndex}
          isProcessing={isProcessing}
        />

        {/* 3. Upload Section (Card 1: Sách, Card 2: KOL & Main CTA Button) */}
        <UploadSection
          bookMedia={bookMedia}
          kolMedia={kolMedia}
          onBookMediaChange={setBookMedia}
          onKolMediaChange={setKolMedia}
          onStartGenerate={handleStartGenerate}
          isProcessing={isProcessing}
          onReset={handleReset}
        />

        {/* 4. n8n Status Live Bar (Hiển thị khi n8n đã nhận 2 file và trả JOB_ID) */}
        {n8nJobResponse && (
          <div className="bg-emerald-50 border-2 border-emerald-500/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 flex-shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-base sm:text-lg text-emerald-950">
                    “Đã nhận yêu cầu”
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold text-xs">
                    n8n Webhook Connected
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Đã nhận thành công 2 file: <strong>{bookMedia?.name}</strong> + <strong>{kolMedia?.name}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="bg-white px-3.5 py-2 rounded-xl border border-emerald-300 font-mono text-xs">
                <span className="text-slate-500 font-semibold">Mã Job: </span>
                <span className="text-emerald-700 font-extrabold">{n8nJobResponse.job_id}</span>
              </div>
            </div>
          </div>
        )}

        {/* 5. Progress Tracker (Card: Tiến trình tạo video - 8 States & Console logs) */}
        {(isProcessing || isCompleted || executionLogs.length > 0) && (
          <ProgressTracker
            steps={processSteps}
            currentStepIndex={currentStepIndex}
            isProcessing={isProcessing}
            logs={executionLogs}
            jobId={currentJobId}
            n8nResponse={n8nJobResponse}
          />
        )}

        {/* 6. Preview Section (Khung Video 9:16 + Storyboard 5 Phân Cảnh) */}
        <PreviewSection
          storyboard={storyboard}
          isCompleted={isCompleted}
          isProcessing={isProcessing}
          bookImage={bookMedia}
          kolImage={kolMedia}
        />

        {/* 7. Google Drive Folder Explorer (Folder + 6 Files) */}
        <DriveFolderViewer
          files={driveFiles}
          jobId={currentJobId}
          folderPath={`TRÍ AI VIDEO FACTORY / 2026 / 10 / ${currentJobId}`}
        />

        {/* 8. Caption Card (Auto-generated Caption + Hashtags + One-click Copy) */}
        <CaptionCard
          captionText={captionText}
          hashtags={hashtags}
        />

      </main>

      {/* 9. Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyJobs={historyJobs}
        onSelectJob={handleSelectJobFromHistory}
      />

      <DriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        files={driveFiles}
        jobId={currentJobId}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
      />

      {/* 10. Footer */}
      <Footer />
    </div>
  );
};

export default App;
