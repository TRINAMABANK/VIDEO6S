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

import type { UploadedMedia, ProcessStep, StoryboardScene, DriveItem, GenerationJob, AppSettings, N8nResponse } from './types';
import { INITIAL_PROCESS_STEPS, DEFAULT_STORYBOARD, DEFAULT_DRIVE_FILES, SAMPLE_CAPTION, DEFAULT_SETTINGS } from './constants/mockData';
import { VideoFactoryService, mediaToFile } from './services/videoFactoryService';
import { N8N_WEBHOOK_URL } from './config/env';
import { triggerCelebration } from './utils/helpers';
import { AlertTriangle, Settings as SettingsIcon } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation & Modals
  const [activeNavTab, setActiveNavTab] = useState<'create' | 'history' | 'drive' | 'settings'>('create');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => {
    return {
      ...DEFAULT_SETTINGS,
      n8nWebhookUrl: N8N_WEBHOOK_URL || DEFAULT_SETTINGS.n8nWebhookUrl
    };
  });

  // Upload States (Default pre-loaded with sample images matching screenshot)
  const [bookMedia, setBookMedia] = useState<UploadedMedia | null>({
    file: null,
    name: '01_BOOK.jpg',
    size: 1024 * 850,
    type: 'image/jpeg',
    previewUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'
  });

  const [kolMedia, setKolMedia] = useState<UploadedMedia | null>({
    file: null,
    name: '02_KOL.jpg',
    size: 1024 * 920,
    type: 'image/jpeg',
    previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  });

  // Generation Execution States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(4); // Default at active state for presentation
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(() => {
    return INITIAL_PROCESS_STEPS.map((s, idx) => {
      if (idx < 4) return { ...s, status: 'completed' as const, timestamp: `14:2${5 + Math.floor(idx * 0.4)}` };
      if (idx === 4) return { ...s, status: 'running' as const, timestamp: '14:27' };
      return { ...s, status: 'idle' as const };
    });
  });

  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [currentJobId, setCurrentJobId] = useState('JOB-0001_DAC-NHAN-TAM');
  const [n8nJobResponse, setN8nJobResponse] = useState<N8nResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  // Active webhook URL check
  const activeWebhookUrl = settings.n8nWebhookUrl || N8N_WEBHOOK_URL;
  const isWebhookConfigured = Boolean(
    activeWebhookUrl &&
    !activeWebhookUrl.includes('YOUR-N8N-DOMAIN') &&
    !activeWebhookUrl.includes('yourdomain.com')
  );

  /**
   * Main Button Action: BƯỚC 2 N8N WEBHOOK
   */
  const handleStartGenerate = async () => {
    if (!bookMedia || !kolMedia) {
      alert('Vui lòng upload đủ 1 ảnh cuốn sách và 1 ảnh KOL trước khi tạo video.');
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    setIsCompleted(false);
    setErrorMessage(null);
    setN8nJobResponse(null);
    setCurrentStepIndex(0);

    const now = new Date();
    const cleanSteps: ProcessStep[] = INITIAL_PROCESS_STEPS.map(s => ({ ...s, status: 'idle' }));
    setProcessSteps(cleanSteps);

    setExecutionLogs([
      `[${now.toLocaleTimeString()}] 🚀 [ANTIGRAVITY] Bắt đầu phiên làm việc: Gửi Sách & KOL tới N8N WEBHOOK...`
    ]);

    try {
      const bookFile = await mediaToFile(bookMedia, '01_BOOK.jpg');
      const kolFile = await mediaToFile(kolMedia, '02_KOL.jpg');

      if (isWebhookConfigured) {
        cleanSteps[0].status = 'running';
        cleanSteps[0].timestamp = new Date().toLocaleTimeString();
        setProcessSteps([...cleanSteps]);

        const n8nRes = await VideoFactoryService.sendToN8n(bookFile, kolFile, activeWebhookUrl);
        const jobId = n8nRes.job_id || `JOB-${String(Math.floor(Math.random() * 9000) + 1000)}`;

        setN8nJobResponse(n8nRes);
        setCurrentJobId(jobId);

        cleanSteps[0].status = 'completed';
        cleanSteps[0].description = `n8n đã nhận 2 file • Mã Job: ${jobId}`;
        setProcessSteps([...cleanSteps]);

        setIsCompleted(true);
        setIsProcessing(false);
        triggerCelebration();

        const newJob: GenerationJob = {
          jobId,
          createdAt: new Date(),
          status: 'received',
          currentStepIndex: 1,
          bookImage: bookMedia,
          kolImage: kolMedia,
          storyboard: DEFAULT_STORYBOARD,
          driveFiles: DEFAULT_DRIVE_FILES,
          caption: captionText,
          hashtags,
          executionLogs
        };

        setHistoryJobs(prev => [newJob, ...prev]);

      } else {
        // DEMO SIMULATION MODE
        await VideoFactoryService.runDemoSimulation(
          bookMedia,
          kolMedia,
          {
            onStepUpdate: (updatedSteps, activeIdx, log) => {
              setProcessSteps(updatedSteps);
              setCurrentStepIndex(activeIdx);
              setExecutionLogs(prev => [log, ...prev]);
            },
            onJobReceived: (jobRes) => {
              setN8nJobResponse(jobRes);
              if (jobRes.job_id) setCurrentJobId(jobRes.job_id);
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
              setErrorMessage(errMsg);
            }
          }
        );
      }
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Lỗi khi gửi dữ liệu lên n8n Webhook.');
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
    <div className="min-h-screen bg-[#f3f6fc] flex flex-col selection:bg-brand-500 selection:text-white font-sans">
      {/* 1. Header (Dark Navy Theme) */}
      <Header
        activeTab={activeNavTab}
        onTabChange={handleTabChange}
        historyCount={historyJobs.length}
      />

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-5">
        
        {/* Top Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-1.5 pt-1">
          <h1 className="text-2xl sm:text-3xl md:text-[32px] font-black text-slate-900 tracking-tight">
            Tạo Video Quảng Cáo Sách 6 Giây
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Chỉ cần upload ảnh cuốn sách và ảnh KOL, hệ thống sẽ tự động tạo video, lưu vào Google Drive với đầy đủ storyboard, hình ảnh và caption.
          </p>
        </div>

        {/* 6 Steps Process Workflow Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:px-8">
          <ProcessWorkflow
            currentStepIndex={currentStepIndex}
            isProcessing={isProcessing}
          />
        </div>

        {/* Warning Banner (If n8n not configured) */}
        {!isWebhookConfigured && (
          <div className="bg-amber-50 border border-amber-300/80 rounded-xl p-3 px-4 flex items-center justify-between text-xs text-amber-900 shadow-sm">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>⚠️ n8n Webhook:</strong> Đang chạy ở chế độ <strong>Demo Simulation</strong>. Bạn có thể nhập webhook URL thực tế trong mục Cài đặt.
              </span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-amber-800 hover:text-amber-950 font-bold underline flex items-center gap-1"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Cài đặt URL</span>
            </button>
          </div>
        )}

        {/* Error Alert Display */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 px-4 text-xs text-rose-900 flex items-center justify-between">
            <span><strong>Lỗi Webhook:</strong> {errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="font-bold text-rose-700">Đóng</button>
          </div>
        )}

        {/* MIDDLE SECTION: Left (Upload + Preview & Storyboard) | Right (Progress Timeline Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Main Work Area (8 columns) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Sub-Left: 2 Upload Cards + Big Gradient CTA (5 cols) */}
            <div className="md:col-span-5 h-full">
              <UploadSection
                bookMedia={bookMedia}
                kolMedia={kolMedia}
                onBookMediaChange={setBookMedia}
                onKolMediaChange={setKolMedia}
                onStartGenerate={handleStartGenerate}
                isProcessing={isProcessing}
              />
            </div>

            {/* Sub-Right: Preview & Storyboard (7 cols) */}
            <div className="md:col-span-7 h-full">
              <PreviewSection
                storyboard={storyboard}
                isCompleted={isCompleted}
                isProcessing={isProcessing}
                bookImage={bookMedia}
                kolImage={kolMedia}
              />
            </div>
          </div>

          {/* Right Sidebar: Progress Tracker + Sau khi hoan thanh (4 columns) */}
          <div className="lg:col-span-4 h-full">
            <ProgressTracker
              steps={processSteps}
              currentStepIndex={currentStepIndex}
              isProcessing={isProcessing}
              logs={executionLogs}
              jobId={currentJobId}
              n8nResponse={n8nJobResponse}
            />
          </div>

        </div>

        {/* BOTTOM SECTION: Left (Google Drive) | Right (Caption) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left: Google Drive Folder Viewer (7 columns) */}
          <div className="lg:col-span-7 h-full">
            <DriveFolderViewer
              files={driveFiles}
              jobId={currentJobId}
              folderPath={`TRÍ AI VIDEO FACTORY / 2026 / 10 / ${currentJobId}`}
            />
          </div>

          {/* Right: Caption Card (5 columns) */}
          <div className="lg:col-span-5 h-full">
            <CaptionCard />
          </div>

        </div>

      </main>

      {/* Modals */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
