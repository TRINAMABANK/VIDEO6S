import React from 'react';
import { Rocket, Sparkles, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { UploadCard } from './UploadCard';
import type { UploadedMedia } from '../../types';

interface UploadSectionProps {
  bookMedia: UploadedMedia | null;
  kolMedia: UploadedMedia | null;
  onBookMediaChange: (media: UploadedMedia | null) => void;
  onKolMediaChange: (media: UploadedMedia | null) => void;
  onStartGenerate: () => void;
  isProcessing: boolean;
  onReset: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  bookMedia,
  kolMedia,
  onBookMediaChange,
  onKolMediaChange,
  onStartGenerate,
  isProcessing,
  onReset
}) => {
  const isReady = !!(bookMedia && kolMedia);

  const sampleBooks = [
    {
      name: 'Nghi-Giau-Lam-Giau.jpg',
      label: 'Nghĩ Giàu Làm Giàu',
      url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Dac-Nhan-Tam.jpg',
      label: 'Đắc Nhân Tâm',
      url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const sampleKols = [
    {
      name: 'KOL-Nu-BookTok.jpg',
      label: 'KOL Nữ (Reviewer)',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'KOL-Nam-Expert.jpg',
      label: 'KOL Nam (Chuyên gia)',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <section className="space-y-6">
      {/* Title & Subtitle */}
      <div className="text-center max-w-3xl mx-auto space-y-2.5 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-200/80 text-brand-700 text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Công Nghệ AI Sản Xuất Video Siêu Tốc 6 Giây</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Tạo Video Quảng Cáo Sách 6 Giây
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Chỉ cần upload ảnh cuốn sách và ảnh KOL, hệ thống sẽ tự động tạo video và lưu vào Google Drive.
        </p>
      </div>

      {/* Upload Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadCard
          cardIndex={1}
          title="1. Ảnh cuốn sách"
          subtitle="Tải lên bìa trước hoặc ảnh thực tế cuốn sách"
          mediaType="book"
          uploadedMedia={bookMedia}
          onFileSelect={onBookMediaChange}
          onRemove={() => onBookMediaChange(null)}
          sampleImages={sampleBooks}
          disabled={isProcessing}
        />

        <UploadCard
          cardIndex={2}
          title="2. Ảnh KOL"
          subtitle="Tải lên ảnh chân dung KOL / Reviewer đại diện"
          mediaType="kol"
          uploadedMedia={kolMedia}
          onFileSelect={onKolMediaChange}
          onRemove={() => onKolMediaChange(null)}
          sampleImages={sampleKols}
          disabled={isProcessing}
        />
      </div>

      {/* CTA Button & Status Indicator */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-left w-full sm:w-auto">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isReady
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {isReady ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900">
              {isReady
                ? 'Đã sẵn sàng tạo video quảng cáo 6 giây'
                : 'Cần đủ 2 ảnh (Sách + KOL) để bắt đầu'}
            </div>
            <div className="text-xs text-slate-500">
              {bookMedia ? '✓ Đã có ảnh sách' : '○ Chưa có ảnh sách'} •{' '}
              {kolMedia ? '✓ Đã có ảnh KOL' : '○ Chưa có ảnh KOL'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {isReady && !isProcessing && (
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-3 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Làm mới</span>
            </button>
          )}

          <button
            type="button"
            onClick={onStartGenerate}
            disabled={!isReady || isProcessing}
            className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2.5 transition-all duration-300 shadow-md ${
              isReady && !isProcessing
                ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-purple-600 text-white hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                : isProcessing
                ? 'bg-slate-700 text-white cursor-wait'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/60 shadow-none'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>ĐANG XỬ LÝ TIẾN TRÌNH...</span>
              </>
            ) : (
              <>
                <Rocket className={`w-5 h-5 ${isReady ? 'animate-bounce' : ''}`} />
                <span>🚀 TẠO VIDEO 6 GIÂY NGAY</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
