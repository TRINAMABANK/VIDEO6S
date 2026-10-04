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
import { CheckCircle2, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';

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

  // Reset entire state
  const handleReset = () => {
    setBookMedia(null);
    setKolMedia(null);
    setIsProcessing(false);
    setIsCompleted(false);
    setCurrentStepIndex(0);
    setN8nJobResponse(null);
    setErrorMessage(null);
    setProcessSteps(INITIAL_PROCESS_STEPS.map(s => ({ ...s, status: 'idle' })));
    setExecutionLogs([]);
  };

  // Active webhook URL check
  const activeWebhookUrl = settings.n8nWebhookUrl || N8N_WEBHOOK_URL;
  const isWebhookConfigured = Boolean(
    activeWebhookUrl &&
    !activeWebhookUrl.includes('YOUR-N8N-DOMAIN') &&
    !activeWebhookUrl.includes('yourdomain.com')
  );

  /**
   * BƯỚC 2: LOGIC GỬI N8N WEBHOOK
   * 1. Kiểm tra bookFile
   * 2. Kiểm tra kolFile
   * 3. Nếu thiếu -> báo lỗi
   * 4. Nếu đủ -> gọi sendToN8n(bookFile, kolFile)
   * 5. Hiển thị trạng thái "Đang gửi dữ liệu..."
   * 6. Nhận job_id -> Hiển thị Job ID & "Đã gửi sang n8n" / "Đã nhận yêu cầu"
   */
  const handleStartGenerate = async () => {
    // 1. Kiểm tra bookFile & kolFile
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
      `[${now.toLocaleTimeString()}] 🚀 [ANTIGRAVITY] Khởi chạy: Đang chuẩn bị gửi ảnh Sách ("${bookMedia.name}") & KOL ("${kolMedia.name}")...`
    ]);

    try {
      // Convert to standard File objects
      const bookFile = await mediaToFile(bookMedia, '01_BOOK.jpg');
      const kolFile = await mediaToFile(kolMedia, '02_KOL.jpg');

      if (isWebhookConfigured) {
        // GỬI LÊN N8N WEBHOOK THỰC TẾ
        setExecutionLogs(prev => [
          `[${new Date().toLocaleTimeString()}] 📡 [n8n Webhook] Đang gửi dữ liệu (POST multipart/form-data) tới: ${activeWebhookUrl}...`,
          ...prev
        ]);

        cleanSteps[0].status = 'running';
        cleanSteps[0].timestamp = new Date().toLocaleTimeString();
        setProcessSteps([...cleanSteps]);

        const n8nRes = await VideoFactoryService.sendToN8n(bookFile, kolFile, activeWebhookUrl);
        const jobId = n8nRes.job_id || `JOB-${String(Math.floor(Math.random() * 9000) + 1000)}`;

        // CẬP NHẬT TRẠNG THÁI "ĐÃ GỬI SANG n8n" & NHẬN JOB ID
        setN8nJobResponse(n8nRes);
        setCurrentJobId(jobId);

        cleanSteps[0].status = 'completed';
        cleanSteps[0].description = `n8n đã nhận 2 file • Mã Job: ${jobId}`;
        setProcessSteps([...cleanSteps]);

        setExecutionLogs(prev => [
          `[${new Date().toLocaleTimeString()}] ✅ [n8n Webhook 200 OK] Nhận phản hồi thành công: "${n8nRes.message || 'Files received'}" | JOB_ID: ${jobId}`,
          ...prev
        ]);

        // Cập nhật kết quả & Drive files
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
          driveFiles: DEFAULT_DRIVE_FILES.map(file => ({
            ...file,
            previewUrl: file.name.includes('BOOK') ? bookMedia.previewUrl || undefined : 
                        file.name.includes('KOL') ? kolMedia.previewUrl || undefined : undefined
          })),
          caption: `${SAMPLE_CAPTION.title}\n\n${SAMPLE_CAPTION.body}\n\n${SAMPLE_CAPTION.cta}`,
          hashtags: SAMPLE_CAPTION.hashtags,
          executionLogs: [
            `[${new Date().toLocaleTimeString()}] ✅ [n8n Webhook] Gửi 2 tệp thành công. Trạng thái: "Đã nhận yêu cầu" • JOB_ID: ${jobId}`
          ]
        };

        setHistoryJobs(prev => [newJob, ...prev]);

      } else {
        // CHẾ ĐỘ DEMO SIMULATION (Khi chưa cấu hình URL n8n thực tế)
        setExecutionLogs(prev => [
          `[${new Date().toLocaleTimeString()}] 💡 [Test Mode] n8n Webhook URL chưa được cấu hình. Đang chạy mô phỏng tiến trình...`,
          ...prev
        ]);

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
      setExecutionLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ❌ [LỖI WEBHOOK] ${err.message || 'Không thể kết nối n8n'}`,
        ...prev
      ]);
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Webhook Configuration Status Notice (If not yet configured) */}
        {!isWebhookConfigured && (
          <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-amber-950">
                  ⚠️ n8n Webhook chưa được cấu hình
                </span>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  Đang chạy ở chế độ <strong>Demo Mode</strong>. Bạn có thể cấu hình <code>VITE_N8N_WEBHOOK_URL</code> trong file <code>.env</code> hoặc bấm Cài đặt để nhập URL Webhook.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-sm transition-colors"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Cấu hình n8n URL</span>
            </button>
          </div>
        )}

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

        {/* Error Alert Display */}
        {errorMessage && (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-xs text-rose-900 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="font-bold text-rose-700">Lỗi gửi n8n:</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 hover:text-rose-800 font-bold px-2 py-1"
            >
              Đóng
            </button>
          </div>
        )}

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
                    “Đã gửi sang n8n” – {n8nJobResponse.message || 'Đã nhận yêu cầu'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold text-xs">
                    Status: {n8nJobResponse.status || 'received'}
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Đã nhận thành công 2 file: <strong>{bookMedia?.name}</strong> + <strong>{kolMedia?.name}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="bg-white px-3.5 py-2 rounded-xl border border-emerald-300 font-mono text-xs shadow-sm">
                <span className="text-slate-500 font-semibold">JOB ID: </span>
                <span className="text-emerald-700 font-extrabold">{n8nJobResponse.job_id || currentJobId}</span>
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
