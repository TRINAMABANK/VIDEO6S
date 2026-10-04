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

import type { UploadedMedia, ProcessStep, StoryboardScene, DriveItem, GenerationJob, AppSettings } from './types';
import { INITIAL_PROCESS_STEPS, DEFAULT_STORYBOARD, DEFAULT_DRIVE_FILES, SAMPLE_CAPTION, DEFAULT_SETTINGS } from './constants/mockData';
import { VideoFactoryService } from './services/videoFactoryService';
import { triggerCelebration } from './utils/helpers';

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
    setProcessSteps(INITIAL_PROCESS_STEPS.map(s => ({ ...s, status: 'idle' })));
    setExecutionLogs([]);
  };

  // Main Action: Start Demo Generation
  const handleStartGenerate = async () => {
    if (!bookMedia || !kolMedia || isProcessing) return;

    setIsProcessing(true);
    setIsCompleted(false);
    setCurrentStepIndex(0);
    setExecutionLogs([`[${new Date().toLocaleTimeString()}] 🚀 Khởi chạy TRÍ AI Video Pipeline...`]);

    // Reset step statuses to idle
    const cleanSteps = INITIAL_PROCESS_STEPS.map(s => ({ ...s, status: 'idle' as const }));
    setProcessSteps(cleanSteps);

    try {
      await VideoFactoryService.runDemoProgressSimulation(
        bookMedia,
        kolMedia,
        {
          onStepUpdate: (updatedSteps, activeIdx, log) => {
            setProcessSteps(updatedSteps);
            setCurrentStepIndex(activeIdx);
            setExecutionLogs(prev => [log, ...prev]);
          },
          onComplete: (result) => {
            setIsProcessing(false);
            setIsCompleted(true);
            setCurrentJobId(result.jobId);
            setStoryboard(result.storyboard);
            setDriveFiles(result.driveFiles);
            setCaptionText(result.caption);
            setHashtags(result.hashtags);

            // Trigger celebration
            triggerCelebration();

            // Save to history
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
            alert(`Lỗi: ${errMsg}`);
          }
        }
      );
    } catch (err) {
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

        {/* 4. Progress Tracker (Card: Tiến trình tạo video - 8 States & Console logs) */}
        {(isProcessing || isCompleted || executionLogs.length > 0) && (
          <ProgressTracker
            steps={processSteps}
            currentStepIndex={currentStepIndex}
            isProcessing={isProcessing}
            logs={executionLogs}
            jobId={currentJobId}
          />
        )}

        {/* 5. Preview Section (Khung Video 9:16 + Storyboard 5 Phân Cảnh) */}
        <PreviewSection
          storyboard={storyboard}
          isCompleted={isCompleted}
          isProcessing={isProcessing}
          bookImage={bookMedia}
          kolImage={kolMedia}
        />

        {/* 6. Google Drive Folder Explorer (Folder + 6 Files) */}
        <DriveFolderViewer
          files={driveFiles}
          jobId={currentJobId}
          folderPath={`TRÍ AI VIDEO FACTORY / 2026 / 10 / ${currentJobId}`}
        />

        {/* 7. Caption Card (Auto-generated Caption + Hashtags + One-click Copy) */}
        <CaptionCard
          captionText={captionText}
          hashtags={hashtags}
        />

      </main>

      {/* 8. Modals */}
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

      {/* 9. Footer */}
      <Footer />
    </div>
  );
};

export default App;
