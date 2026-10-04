import type { ProcessStep, UploadedMedia, StoryboardScene, DriveItem } from '../types';
import { INITIAL_PROCESS_STEPS, DEFAULT_STORYBOARD, DEFAULT_DRIVE_FILES, SAMPLE_CAPTION } from '../constants/mockData';
import { delay } from '../utils/helpers';

export interface ProgressCallback {
  onStepUpdate: (steps: ProcessStep[], activeIndex: number, logMessage: string) => void;
  onComplete: (result: DemoGenerationResult) => void;
  onError?: (error: string) => void;
}

export interface DemoGenerationResult {
  jobId: string;
  storyboard: StoryboardScene[];
  driveFiles: DriveItem[];
  caption: string;
  hashtags: string[];
  videoUrl: string;
  completedAt: Date;
}

/**
 * Service layer for TRÍ AI – BOOK VIDEO FACTORY
 * Step 1: UI Simulation & State Progression
 * Step 2 Ready: Easily swappable to n8n webhook API
 */
export class VideoFactoryService {
  /**
   * Step 1: Demo Progress Simulation
   * Simulates the 8 execution stages with realistic timing and logs
   */
  public static async runDemoProgressSimulation(
    bookImage: UploadedMedia,
    kolImage: UploadedMedia,
    callbacks: ProgressCallback,
    abortSignal?: { aborted: boolean }
  ): Promise<void> {
    const steps: ProcessStep[] = JSON.parse(JSON.stringify(INITIAL_PROCESS_STEPS));
    const now = new Date();
    const jobId = `JOB-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    const logMessages = [
      `[${now.toLocaleTimeString()}] 📦 [BƯỚC 1/8] Đã nhận ảnh sách "${bookImage.name || 'book.jpg'}" và KOL "${kolImage.name || 'kol.jpg'}". Đang kiểm tra định dạng...`,
      `[${now.toLocaleTimeString()}] 🧠 [BƯỚC 2/8] AI Vision đang nhận diện nội dung bìa sách và bóc tách chân dung KOL...`,
      `[${now.toLocaleTimeString()}] 📝 [BƯỚC 3/8] Đã hoàn thành phân tích. Đang tạo Storyboard 5 phân cảnh (Hook -> Intro -> KOL -> Features -> CTA)...`,
      `[${now.toLocaleTimeString()}] 🎨 [BƯỚC 4/8] Đang kết hợp Key Visual quảng cáo 3D phối cảnh sách và KOL...`,
      `[${now.toLocaleTimeString()}] 🎬 [BƯỚC 5/8] Đang sinh video chuyển động 6 giây dọc 9:16 (60 FPS)...`,
      `[${now.toLocaleTimeString()}] 🔍 [BƯỚC 6/8] Kiểm tra chất lượng (QC): Đạt chuẩn âm thanh, visual sắc nét và tỷ lệ khung hình 9:16...`,
      `[${now.toLocaleTimeString()}] ☁️ [BƯỚC 7/8] Đang xuất 6 tệp tài nguyên và đồng bộ vào Google Drive thư mục /2026/10/${jobId}...`,
      `[${now.toLocaleTimeString()}] ✅ [BƯỚC 8/8] HOÀN TẤT TOÀN BỘ! Video 6 giây và bộ tài nguyên sẵn sàng xuất bản.`
    ];

    const stepDelays = [700, 1100, 900, 1200, 1500, 800, 900, 600];

    for (let i = 0; i < steps.length; i++) {
      if (abortSignal?.aborted) {
        callbacks.onError?.('Tiến trình đã bị dừng bởi người dùng.');
        return;
      }

      // Mark current step as running
      steps[i].status = 'running';
      steps[i].timestamp = new Date().toLocaleTimeString();
      callbacks.onStepUpdate([...steps], i, logMessages[i]);

      await delay(stepDelays[i]);

      if (abortSignal?.aborted) return;

      // Mark current step as completed
      steps[i].status = 'completed';
      callbacks.onStepUpdate([...steps], i, `[${new Date().toLocaleTimeString()}] ✓ ${steps[i].label} - Thành công.`);
    }

    // Return complete payload result
    const result: DemoGenerationResult = {
      jobId,
      storyboard: DEFAULT_STORYBOARD,
      driveFiles: DEFAULT_DRIVE_FILES.map(file => ({
        ...file,
        previewUrl: file.name.includes('BOOK') ? bookImage.previewUrl || undefined : 
                    file.name.includes('KOL') ? kolImage.previewUrl || undefined : undefined
      })),
      caption: `${SAMPLE_CAPTION.title}\n\n${SAMPLE_CAPTION.body}\n\n${SAMPLE_CAPTION.cta}`,
      hashtags: SAMPLE_CAPTION.hashtags,
      videoUrl: 'demo-video-placeholder',
      completedAt: new Date()
    };

    callbacks.onComplete(result);
  }

  /**
   * Placeholder ready for Step 2 (n8n Webhook / Backend API)
   */
  public static async executeN8nWorkflow(
    _bookFile: File,
    _kolFile: File,
    _webhookUrl: string
  ): Promise<DemoGenerationResult> {
    throw new Error('Bước 1 hiện tại chỉ chạy Frontend/UI Demo. Tính năng kết nối n8n API sẽ kích hoạt ở Bước 2.');
  }
}
