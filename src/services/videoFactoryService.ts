import type { ProcessStep, UploadedMedia, StoryboardScene, DriveItem, N8nResponse } from '../types';
import { INITIAL_PROCESS_STEPS, DEFAULT_STORYBOARD, DEFAULT_DRIVE_FILES, SAMPLE_CAPTION } from '../constants/mockData';
import { N8N_WEBHOOK_URL } from '../config/env';
import { delay } from '../utils/helpers';

export interface ProgressCallback {
  onStepUpdate: (steps: ProcessStep[], activeIndex: number, logMessage: string) => void;
  onJobReceived?: (jobResponse: N8nResponse) => void;
  onComplete: (result: DemoGenerationResult) => void;
  onError?: (error: string) => void;
}

export interface DemoGenerationResult {
  jobId: string;
  status: 'received' | 'completed';
  message: string;
  storyboard: StoryboardScene[];
  driveFiles: DriveItem[];
  caption: string;
  hashtags: string[];
  videoUrl: string;
  completedAt: Date;
}

/**
 * Helper to convert UploadedMedia to standard File object
 */
export async function mediaToFile(media: UploadedMedia, defaultFilename: string): Promise<File> {
  if (media.file) {
    return media.file;
  }
  if (media.previewUrl?.startsWith('data:')) {
    const res = await fetch(media.previewUrl);
    const blob = await res.blob();
    return new File([blob], media.name || defaultFilename, { type: blob.type || 'image/jpeg' });
  }
  if (media.previewUrl?.startsWith('http')) {
    try {
      const res = await fetch(media.previewUrl, { mode: 'cors' });
      const blob = await res.blob();
      return new File([blob], media.name || defaultFilename, { type: blob.type || 'image/jpeg' });
    } catch {
      const blob = new Blob(['sample-image-data'], { type: 'image/jpeg' });
      return new File([blob], media.name || defaultFilename, { type: 'image/jpeg' });
    }
  }
  const blob = new Blob(['image-data'], { type: 'image/jpeg' });
  return new File([blob], media.name || defaultFilename, { type: 'image/jpeg' });
}

export class VideoFactoryService {
  /**
   * BƯỚC 2: GỬI 2 FILE SÁCH VÀ KOL LÊN N8N WEBHOOK
   * - Endpoint: POST ${VITE_N8N_WEBHOOK_URL}
   * - Body: FormData (book, kol)
   * - Browser tự sinh multipart/form-data boundary
   */
  public static async sendToN8n(
    bookFile: File,
    kolFile: File,
    customWebhookUrl?: string
  ): Promise<N8nResponse> {
    const webhookUrl = (customWebhookUrl || N8N_WEBHOOK_URL).trim();

    if (!webhookUrl) {
      throw new Error('VITE_N8N_WEBHOOK_URL chưa được cấu hình. Vui lòng thêm vào file .env hoặc cấu hình trong Cài đặt.');
    }

    const formData = new FormData();
    formData.append('book', bookFile);
    formData.append('kol', kolFile);
    formData.append('timestamp', new Date().toISOString());
    formData.append('source', 'ANTIGRAVITY_BOOK_VIDEO_FACTORY');

    // DO NOT set 'Content-Type' header so browser automatically sets multipart/form-data with boundary
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`n8n Webhook trả về lỗi HTTP: ${response.status} (${response.statusText})`);
    }

    const text = await response.text();
    let data: N8nResponse;
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        success: true,
        job_id: `JOB-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        status: 'received',
        message: text || 'Files received successfully'
      };
    }

    if (data.success === false) {
      throw new Error(data.message || 'n8n Webhook báo lỗi xử lý tệp.');
    }

    // Normalize job_id if necessary
    const jobId =
      data.job_id ||
      (data as Record<string, unknown>).jobId as string ||
      (data as Record<string, unknown>).id as string ||
      `JOB-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    return {
      ...data,
      success: true,
      job_id: jobId,
      status: data.status || 'received',
      message: data.message || 'Files received successfully'
    };
  }

  /**
   * Demo Simulation Runner (used when n8n webhook is not configured or in test mode)
   */
  public static async runDemoSimulation(
    bookMedia: UploadedMedia,
    kolMedia: UploadedMedia,
    callbacks: ProgressCallback,
    abortSignal?: { aborted: boolean }
  ): Promise<void> {
    const steps: ProcessStep[] = JSON.parse(JSON.stringify(INITIAL_PROCESS_STEPS));
    const now = new Date();
    const jobId = `JOB-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    const logMessages = [
      `[${now.toLocaleTimeString()}] 📦 [BƯỚC 1/8] [Demo Mode] Đã nhận ảnh sách "${bookMedia.name || 'book.jpg'}" và KOL "${kolMedia.name || 'kol.jpg'}".`,
      `[${now.toLocaleTimeString()}] 🧠 [BƯỚC 2/8] AI Vision đang nhận diện nội dung bìa sách và bóc tách chân dung KOL...`,
      `[${now.toLocaleTimeString()}] 📝 [BƯỚC 3/8] Đã hoàn thành phân tích. Đang tạo Storyboard 5 phân cảnh (Hook -> Intro -> KOL -> Features -> CTA)...`,
      `[${now.toLocaleTimeString()}] 🎨 [BƯỚC 4/8] Đang kết hợp Key Visual quảng cáo 3D phối cảnh sách và KOL...`,
      `[${now.toLocaleTimeString()}] 🎬 [BƯỚC 5/8] Đang sinh video chuyển động 6 giây dọc 9:16 (60 FPS)...`,
      `[${now.toLocaleTimeString()}] 🔍 [BƯỚC 6/8] Kiểm tra chất lượng (QC): Đạt chuẩn âm thanh, visual sắc nét và tỷ lệ khung hình 9:16...`,
      `[${now.toLocaleTimeString()}] ☁️ [BƯỚC 7/8] Đang xuất 6 tệp tài nguyên và đồng bộ vào Google Drive thư mục /2026/10/${jobId}...`,
      `[${now.toLocaleTimeString()}] ✅ [BƯỚC 8/8] HOÀN TẤT TOÀN BỘ! Video 6 giây và bộ tài nguyên đã sẵn sàng.`
    ];

    const stepDelays = [700, 1000, 900, 1100, 1200, 800, 900, 600];

    // Trigger mock job received
    callbacks.onJobReceived?.({
      success: true,
      job_id: jobId,
      status: 'received',
      message: 'Files received successfully (Demo Mode)'
    });

    for (let i = 0; i < steps.length; i++) {
      if (abortSignal?.aborted) return;

      steps[i].status = 'running';
      steps[i].timestamp = new Date().toLocaleTimeString();
      callbacks.onStepUpdate([...steps], i, logMessages[i]);

      await delay(stepDelays[i]);

      if (abortSignal?.aborted) return;

      steps[i].status = 'completed';
      callbacks.onStepUpdate([...steps], i, `[${new Date().toLocaleTimeString()}] ✓ ${steps[i].label} - Thành công.`);
    }

    const result: DemoGenerationResult = {
      jobId,
      status: 'completed',
      message: 'Hoàn tất quy trình sản xuất video 6s',
      storyboard: DEFAULT_STORYBOARD,
      driveFiles: DEFAULT_DRIVE_FILES.map(file => ({
        ...file,
        previewUrl: file.name.includes('BOOK') ? bookMedia.previewUrl || undefined : 
                    file.name.includes('KOL') ? kolMedia.previewUrl || undefined : undefined
      })),
      caption: `${SAMPLE_CAPTION.title}\n\n${SAMPLE_CAPTION.body}\n\n${SAMPLE_CAPTION.cta}`,
      hashtags: SAMPLE_CAPTION.hashtags,
      videoUrl: 'demo-video-placeholder',
      completedAt: new Date()
    };

    callbacks.onComplete(result);
  }
}
