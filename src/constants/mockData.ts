import type { StoryboardScene, ProcessStep, DriveItem, AppSettings } from '../types';

export const DEFAULT_WORKFLOW_STEPS: string[] = [
  '1. Upload sách + KOL',
  '2. AI phân tích & storyboard',
  '3. Tạo ảnh quảng cáo',
  '4. Tạo video 6 giây',
  '5. Kiểm tra chất lượng',
  '6. Lưu vào Google Drive'
];

export const INITIAL_PROCESS_STEPS: ProcessStep[] = [
  { id: 1, label: 'Đã nhận ảnh sách và KOL', description: 'Kiểm tra độ phân giải và định dạng hình ảnh', status: 'idle' },
  { id: 2, label: 'Đang phân tích bằng AI', description: 'Trích xuất tựa sách, thông điệp cốt lõi & chân dung KOL', status: 'idle' },
  { id: 3, label: 'Đã tạo storyboard', description: 'Lập kịch bản 5 phân cảnh chuẩn cấu trúc viral 6s', status: 'idle' },
  { id: 4, label: 'Đang tạo ảnh quảng cáo', description: 'Ghép Key Visual phối cảnh 3D kết hợp sách & KOL', status: 'idle' },
  { id: 5, label: 'Đang tạo video 6 giây', description: 'Sinh chuyển động mượt mà 60fps định dạng dọc 9:16', status: 'idle' },
  { id: 6, label: 'Kiểm tra chất lượng', description: 'Đánh giá độ sắc nét, màu sắc và khớp nhịp âm thanh', status: 'idle' },
  { id: 7, label: 'Lưu vào Google Drive', description: 'Đồng bộ hóa dữ liệu vào thư mục JOB-0001 theo chuẩn', status: 'idle' },
  { id: 8, label: 'Hoàn thành', description: 'Video và toàn bộ tài nguyên đã sẵn sàng xuất bản', status: 'idle' }
];

export const DEFAULT_STORYBOARD: StoryboardScene[] = [
  {
    id: 'scene-1',
    timeRange: '0–1s',
    durationSeconds: 1,
    title: 'Hook',
    description: 'Cận cảnh ấn tượng: Cuốn sách phát sáng / mở trang bất ngờ tạo sự tò mò ngay giây đầu tiên.',
    visualPrompt: 'Dynamic extreme close-up of book cover with glowing light effect, fast zoom-in motion, energetic particles.',
    audioPrompt: 'High-impact whoosh sound + catchy energetic intro beat.',
    cameraMovement: 'Fast push-in zoom',
    sceneType: 'hook',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    id: 'scene-2',
    timeRange: '1–2s',
    durationSeconds: 1,
    title: 'Giới thiệu sách',
    description: 'Hiển thị bìa sách rõ nét kèm typography tiêu đề cuốn sách nổi bật và slogan cốt lõi.',
    visualPrompt: 'Clean floating 3D book rotation, elegant gradient studio lighting, bold text overlay of book title.',
    audioPrompt: 'Voiceover: "Cuốn sách đang làm mưa làm gió tuần này..."',
    cameraMovement: 'Smooth 3D orbit rotation',
    sceneType: 'intro',
    badgeColor: 'bg-blue-100 text-brand-800 border-brand-300'
  },
  {
    id: 'scene-3',
    timeRange: '2–4s',
    durationSeconds: 2,
    title: 'KOL tương tác với sách',
    description: 'KOL xuất hiện với biểu cảm ngạc nhiên / cuốn hút khi lật từng trang sách trên tay.',
    visualPrompt: 'Influencer / KOL smiling passionately while holding and reading the book in an aesthetic cozy modern room.',
    audioPrompt: 'Voiceover: "Thay đổi tư duy làm giàu chỉ sau 3 chương đầu!"',
    cameraMovement: 'Medium shot with subtle pan',
    sceneType: 'kol_interaction',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    id: 'scene-4',
    timeRange: '4–5s',
    durationSeconds: 1,
    title: 'Điểm nổi bật',
    description: '3 gạch đầu dòng ngắn gọn về giá trị độc nhất: Kiến thức thực chiến, Dễ áp dụng ngay.',
    visualPrompt: 'Bullet points popping up with clean motion graphics, glowing stars rating 5/5, bestselling badge.',
    audioPrompt: 'Snappy UI pop sound effects for 3 key highlights.',
    cameraMovement: 'Static focus with kinetic typography',
    sceneType: 'highlights',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    id: 'scene-5',
    timeRange: '5–6s',
    durationSeconds: 1,
    title: 'CTA (Kêu gọi hành động)',
    description: 'Nút "Nhấn vào giỏ hàng ngay" nhấp nháy thu hút cùng ưu đãi giới hạn hôm nay.',
    visualPrompt: 'Clear glowing TikTok / Reels Shopping Bag CTA button, "Freeship & Giảm 30% hôm nay", pulsing effect.',
    audioPrompt: 'Voiceover: "Bấm vào góc trái màn hình để sở hữu ngay!"',
    cameraMovement: 'Subtle heartbeat pulse animation',
    sceneType: 'cta',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
  }
];

export const DEFAULT_DRIVE_FOLDER = {
  root: 'TRÍ AI VIDEO FACTORY',
  year: '2026',
  month: '10',
  job: 'JOB-0001',
  fullPath: 'TRÍ AI VIDEO FACTORY / 2026 / 10 / JOB-0001'
};

export const DEFAULT_DRIVE_FILES: DriveItem[] = [
  {
    name: '01_BOOK.jpg',
    size: '1.8 MB',
    type: 'image',
    updatedAt: '2026-10-04 12:45',
    status: 'synced',
    icon: 'image',
    description: 'Ảnh gốc bìa sách chất lượng cao'
  },
  {
    name: '02_KOL.jpg',
    size: '2.4 MB',
    type: 'image',
    updatedAt: '2026-10-04 12:45',
    status: 'synced',
    icon: 'user',
    description: 'Ảnh chân dung KOL đã tách nền tự động'
  },
  {
    name: '03_KEY_VISUAL.jpg',
    size: '3.2 MB',
    type: 'image',
    updatedAt: '2026-10-04 12:46',
    status: 'synced',
    icon: 'sparkles',
    description: 'Ảnh Key Visual phối cảnh quảng cáo 3D'
  },
  {
    name: '04_STORYBOARD.json',
    size: '12 KB',
    type: 'json',
    updatedAt: '2026-10-04 12:46',
    status: 'synced',
    icon: 'file-code',
    description: 'Kịch bản phân cảnh 5 timeline và prompt AI'
  },
  {
    name: '05_VIDEO_6S.mp4',
    size: '8.7 MB',
    type: 'video',
    updatedAt: '2026-10-04 12:47',
    status: 'ready',
    icon: 'film',
    description: 'Video quảng cáo 6s chuẩn 9:16 Full HD 60fps'
  },
  {
    name: '06_CAPTION.txt',
    size: '4 KB',
    type: 'text',
    updatedAt: '2026-10-04 12:47',
    status: 'synced',
    icon: 'file-text',
    description: 'Nội dung caption viral, hashtags và CTA'
  }
];

export const SAMPLE_CAPTION = {
  title: '🔥 BẬT MÍ CUỐN SÁCH THAY ĐỔI TƯ DUY 2026 BẠN NHẤT ĐỊNH PHẢI ĐỌC!',
  body: `Nếu bạn đang tìm kiếm một bước ngoặt bứt phá trong công việc và cuộc sống thì cuốn sách này chính là chìa khóa vàng dành cho bạn! 💡✨

👉 Đọc chỉ 15 phút mỗi ngày – Áp dụng ngay vào thực tế.
👉 Được hàng ngàn độc giả và chuyên gia khuyên đọc.
🎁 Ưu đãi độc quyền hôm nay: Giảm ngay 30% + Freeship toàn quốc!`,
  cta: '👇 Nhấn vào nút MUA NGAY ở góc trái màn hình để nhận ưu đãi trước khi hết hàng nhé!',
  hashtags: ['#TriAI', '#BookReview', '#SachHayMoiNgay', '#PhatTrienBanThan', '#SachKinhDoanh', '#DocSachMoiNgay', '#TrendingTikTok', '#BookTok']
};

export const DEFAULT_SETTINGS: AppSettings = {
  n8nWebhookUrl: 'https://n8n.yourdomain.com/webhook/tri-ai-book-video',
  n8nApiKey: '',
  googleDriveRootFolder: 'TRÍ AI VIDEO FACTORY',
  videoQuality: '1080p',
  aiModelText: 'OpenAI GPT-4o / Grok 3 (n8n ready)',
  aiModelVideo: 'Kling AI / Runway Gen-3 (n8n ready)',
  aspectRatio: '9:16',
  autoDownload: false
};
