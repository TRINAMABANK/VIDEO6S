# 🚀 TRÍ AI – BOOK VIDEO FACTORY

> **Nền tảng tự động sản xuất video quảng cáo sách 6 giây chuẩn TikTok / Reels / Shorts**

---

## 📖 Giới thiệu
**TRÍ AI – BOOK VIDEO FACTORY** là giải pháp SaaS hiện đại giúp các tác giả, nhà xuất bản và nhà sáng tạo nội dung tự động hóa quy trình tạo video quảng cáo ngắn (6 giây) chỉ với **1 ảnh bìa sách** và **1 ảnh KOL / Reviewer**.

---

## 🌟 Tính Năng Nổi Bật (Bước 1: UI / Frontend)

- **Giao diện Modern SaaS**: Thiết kế sắc nét, hiện đại, màu sắc chủ đạo xanh tím, tương thích Responsive.
- **Quy trình 6 bước chuẩn**:
  1. *Upload sách + KOL*
  2. *AI phân tích & Storyboard*
  3. *Tạo ảnh quảng cáo Key Visual 3D*
  4. *Tạo video 6 giây 9:16*
  5. *Kiểm tra chất lượng (QC)*
  6. *Lưu trữ có cấu trúc vào Google Drive*
- **Card Upload thông minh**: Kéo thả ảnh (Drag & Drop), preview tức thì, xóa / thay đổi ảnh linh hoạt.
- **Nút hành động thông minh**: Tự động kích hoạt khi có đủ 2 ảnh (Sách & KOL).
- **Mô phỏng tiến trình 8 trạng thái**: Kèm thanh tiến độ %, hiệu ứng hoạt họa và Live Console Logs thời gian thực.
- **Trình phát video 9:16 tương tác**: Xem trước kịch bản 6s từng phân đoạn kèm Storyboard 5 phân cảnh (*Hook, Giới thiệu sách, KOL tương tác, Điểm nổi bật, CTA*).
- **Google Drive Explorer**: Hiển thị cấu trúc thư mục `TRÍ AI VIDEO FACTORY / 2026 / 10 / JOB-0001` với 6 file tài nguyên chuẩn.
- **AI Copywriting & Hashtags**: Tự động sinh nội dung caption viral và bộ hashtag BookTok kèm nút sao chép 1-click.
- **Sẵn sàng cho Bước 2**: Tách biệt hoàn toàn UI và Service layer (`videoFactoryService.ts`), dễ dàng kết nối Webhook n8n / API AI.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, Tailwind CSS animations

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Local

### 1. Clone repository
```bash
git clone https://github.com/TRINAMABANK/VIDEO6S.git
cd VIDEO6S
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Chạy môi trường phát triển
```bash
npm run dev
```
Truy cập trình duyệt: `http://localhost:5173/`

### 4. Build bản Production
```bash
npm run build
```

---

## 📂 Cấu Trúc Thư Mục
```
src/
├── components/
│   ├── caption/       # CaptionCard.tsx
│   ├── drive/         # DriveFolderViewer.tsx, DriveModal.tsx
│   ├── history/       # HistoryModal.tsx
│   ├── layout/        # Header.tsx, Footer.tsx, ProcessWorkflow.tsx
│   ├── preview/       # VideoPlayer.tsx, StoryboardTimeline.tsx, PreviewSection.tsx
│   ├── progress/      # ProgressTracker.tsx
│   ├── settings/      # SettingsModal.tsx
│   └── upload/        # UploadCard.tsx, UploadSection.tsx
├── constants/         # mockData.ts
├── services/          # videoFactoryService.ts (Sẵn sàng kết nối n8n ở Bước 2)
├── types/             # index.ts
├── utils/             # helpers.ts
├── App.tsx
├── index.css
└── main.tsx
```

---

## 📝 Bản quyền & Giấy phép
© 2026 TRÍ AI. All rights reserved.
