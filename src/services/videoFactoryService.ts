import type { ProcessStep, UploadedMedia, StoryboardScene, DriveItem, N8nWebhookResponse } from '../types';
import { INITIAL_PROCESS_STEPS, DEFAULT_STORYBOARD, DEFAULT_DRIVE_FILES, SAMPLE_CAPTION } from '../constants/mockData';
import { delay } from '../utils/helpers';

export interface ProgressCallback {
  onStepUpdate: (steps: ProcessStep[], activeIndex: number, logMessage: string) => void;
  onJobReceived?: (jobResponse: N8nWebhookResponse) => void;
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
 * Helper to convert dataURL or remote URL to Blob
 */
async function getBlobFromMedia(media: UploadedMedia): Promise<Blob> {
  if (media.file) {
    return media.file;
  }
  if (media.previewUrl?.startsWith('data:')) {
    const res = await fetch(media.previewUrl);
    return await res.blob();
  }
  if (media.previewUrl?.startsWith('http')) {
    try {
      const res = await fetch(media.previewUrl, { mode: 'cors' });
      return await res.blob();
    } catch {
      // Fallback tiny placeholder blob
      return new Blob(['dummy image data'], { type: 'image/jpeg' });
    }
  }
  return new Blob(['dummy image data'], { type: 'image/jpeg' });
}

export class VideoFactoryService {
  /**
   * STEP 2 - GIAI ĐOẠN 1: GỬI 2 FILE LÊN N8N WEBHOOK
   * 1. Nhận 2 file (Book + KOL)
   * 2. Gửi HTTP POST Multipart Form-Data lên n8n Webhook
   * 3. Nhận JOB_ID từ n8n
   * 4. Trả kết quả: "Đã nhận yêu cầu" kèm JOB_ID
   */
  public static async sendToN8nWebhook(
    bookMedia: UploadedMedia,
    kolMedia: UploadedMedia,
    webhookUrl: string,
    apiKey?: string
  ): Promise<N8nWebhookResponse> {
    const formData = new FormData();

    const bookBlob = await getBlobFromMedia(bookMedia);
    const kolBlob = await getBlobFromMedia(kolMedia);

    formData.append('book_image', bookBlob, bookMedia.name || '01_BOOK.jpg');
    formData.append('kol_image', kolBlob, kolMedia.name || '02_KOL.jpg');
    formData.append('book_name', bookMedia.name || 'Book');
    formData.append('kol_name', kolMedia.name || 'KOL');
    formData.append('timestamp', new Date().toISOString());
    formData.append('source', 'ANTIGRAVITY_BOOK_VIDEO_FACTORY');

    const headers: Record<string, string> = {};
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
      headers['X-API-KEY'] = apiKey;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`n8n Webhook trả về mã lỗi HTTP: ${response.status} (${response.statusText})`);
      }

      let data: any = {};
      const responseText = await response.text();
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { raw: responseText };
      }

      const jobId =
        data.job_id ||
        data.jobId ||
        data.id ||
        data.JOB_ID ||
        `JOB-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

      return {
        success: true,
        job_id: jobId,
        status: 'RECEIVED',
        message: data.message || 'Đã nhận yêu cầu',
        received_at: data.received_at || new Date().toISOString(),
        files_received: {
          book: bookMedia.name || '01_BOOK.jpg',
          kol: kolMedia.name || '02_KOL.jpg'
        }
      };
    } catch (err: any) {
      console.warn('Không thể gửi trực tiếp tới URL n8n thực tế:', err.message);
      // If error occurs (e.g. n8n local not started or CORS error during testing), 
      // provide detailed descriptive feedback
      throw new Error(err.message || 'Lỗi kết nối n8n Webhook');
    }
  }

  /**
   * Chạy luồng tích hợp hoàn chỉnh:
   * 1. Gửi Webhook lên n8n
   * 2. Nhận JOB_ID và trạng thái "Đã nhận yêu cầu"
   * 3. Chạy tiếp tiến trình giả lập / phản hồi thời gian thực
   */
  public static async executePipeline(
    bookMedia: UploadedMedia,
    kolMedia: UploadedMedia,
    webhookUrl: string,
    isRealWebhook: boolean,
    callbacks: ProgressCallback,
    abortSignal?: { aborted: boolean }
  ): Promise<void> {
    const steps: ProcessStep[] = JSON.parse(JSON.stringify(INITIAL_PROCESS_STEPS));
    const now = new Date();
    let jobId = `JOB-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    // BƯỚC 1: GỬI LÊN N8N WEBHOOK
    steps[0].status = 'running';
    steps[0].timestamp = now.toLocaleTimeString();
    callbacks.onStepUpdate(
      [...steps],
      0,
      `[${now.toLocaleTimeString()}] 🚀 [ANTIGRAVITY] Đang gửi 2 file (Sách: "${bookMedia.name}", KOL: "${kolMedia.name}") tới n8n Webhook: ${webhookUrl}...`
    );

    let jobResponse: N8nWebhookResponse;

    if (isRealWebhook && webhookUrl && !webhookUrl.includes('yourdomain.com')) {
      try {
        jobResponse = await this.sendToN8nWebhook(bookMedia, kolMedia, webhookUrl);
        jobId = jobResponse.job_id;
      } catch (e: any) {
        callbacks.onError?.(`Kết nối n8n Webhook thất bại: ${e.message}. Vui lòng kiểm tra URL n8n đã được Active chưa.`);
        return;
      }
    } else {
      // Mô phỏng phản hồi n8n Webhook chuẩn (khi đang ở URL placeholder)
      await delay(800);
      jobResponse = {
        success: true,
        job_id: jobId,
        status: 'RECEIVED',
        message: 'Đã nhận yêu cầu',
        received_at: new Date().toISOString(),
        files_received: {
          book: bookMedia.name || '01_BOOK.jpg',
          kol: kolMedia.name || '02_KOL.jpg'
        }
      };
    }

    // ĐÃ NHẬN YÊU CẦU TỪ N8N
    steps[0].status = 'completed';
    steps[0].description = `n8n đã nhận 2 file • Mã Job: ${jobId}`;
    callbacks.onJobReceived?.(jobResponse);
    callbacks.onStepUpdate(
      [...steps],
      0,
      `[${new Date().toLocaleTimeString()}] ✅ [N8N WEBHOOK] 200 OK | Nhận 2 file thành công | Trạng thái: "Đã nhận yêu cầu" | JOB_ID: ${jobId}`
    );

    await delay(700);

    // TIẾP TỤC CÁC BƯỚC XỬ LÝ (2 -> 8)
    const logMessages = [
      '',
      `[${new Date().toLocaleTimeString()}] 🧠 [BƯỚC 2/8] AI Vision đang nhận diện nội dung bìa sách và bóc tách chân dung KOL...`,
      `[${new Date().toLocaleTimeString()}] 📝 [BƯỚC 3/8] Đã hoàn thành phân tích. Đang tạo Storyboard 5 phân cảnh (Hook -> Intro -> KOL -> Features -> CTA)...`,
      `[${new Date().toLocaleTimeString()}] 🎨 [BƯỚC 4/8] Đang kết hợp Key Visual quảng cáo 3D phối cảnh sách và KOL...`,
      `[${new Date().toLocaleTimeString()}] 🎬 [BƯỚC 5/8] Đang sinh video chuyển động 6 giây dọc 9:16 (60 FPS)...`,
      `[${new Date().toLocaleTimeString()}] 🔍 [BƯỚC 6/8] Kiểm tra chất lượng (QC): Đạt chuẩn âm thanh, visual sắc nét và tỷ lệ khung hình 9:16...`,
      `[${new Date().toLocaleTimeString()}] ☁️ [BƯỚC 7/8] Đang xuất 6 tệp tài nguyên và đồng bộ vào Google Drive thư mục /2026/10/${jobId}...`,
      `[${new Date().toLocaleTimeString()}] ✅ [BƯỚC 8/8] HOÀN TẤT TOÀN BỘ! Video 6 giây và bộ tài nguyên đã sẵn sàng.`
    ];

    const stepDelays = [0, 1000, 900, 1100, 1300, 800, 900, 600];

    for (let i = 1; i < steps.length; i++) {
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
