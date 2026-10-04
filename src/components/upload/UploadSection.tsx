import React from 'react';
import { Wand2 } from 'lucide-react';
import { UploadCard } from './UploadCard';
import type { UploadedMedia } from '../../types';

interface UploadSectionProps {
  bookMedia: UploadedMedia | null;
  kolMedia: UploadedMedia | null;
  onBookMediaChange: (media: UploadedMedia | null) => void;
  onKolMediaChange: (media: UploadedMedia | null) => void;
  onStartGenerate: () => void;
  isProcessing: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  bookMedia,
  kolMedia,
  onBookMediaChange,
  onKolMediaChange,
  onStartGenerate,
  isProcessing
}) => {
  const isReady = !!(bookMedia && kolMedia);

  const sampleBooks = [
    {
      name: '01_BOOK.jpg',
      label: 'Đắc Nhân Tâm',
      url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const sampleKols = [
    {
      name: '02_KOL.jpg',
      label: 'KOL Nữ',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="flex flex-col justify-between space-y-4 h-full">
      {/* 2 Upload Cards Side by Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <UploadCard
          title="1. Ảnh cuốn sách"
          mediaType="book"
          uploadedMedia={bookMedia}
          onFileSelect={onBookMediaChange}
          onRemove={() => onBookMediaChange(null)}
          sampleImages={sampleBooks}
          disabled={isProcessing}
        />

        <UploadCard
          title="2. Ảnh KOL"
          mediaType="kol"
          uploadedMedia={kolMedia}
          onFileSelect={onKolMediaChange}
          onRemove={() => onKolMediaChange(null)}
          sampleImages={sampleKols}
          disabled={isProcessing}
        />
      </div>

      {/* Main Gradient CTA Button */}
      <button
        type="button"
        onClick={onStartGenerate}
        disabled={!isReady || isProcessing}
        className={`w-full py-4 px-6 rounded-2xl font-bold flex flex-col items-center justify-center transition-all shadow-md ${
          isReady && !isProcessing
            ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-indigo-500/25 cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
            : isProcessing
            ? 'bg-slate-700 text-white cursor-wait'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/60 shadow-none'
        }`}
      >
        <div className="flex items-center space-x-2 text-base sm:text-lg">
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Wand2 className="w-5 h-5 text-purple-200" />
          )}
          <span className="tracking-wide font-extrabold uppercase">
            {isProcessing ? 'ĐANG XỬ LÝ QUY TRÌNH...' : 'TẠO VIDEO 6 GIÂY NGAY'}
          </span>
        </div>
        <span className="text-[11px] text-purple-100/80 font-normal mt-0.5">
          Hệ thống sẽ tự động chạy toàn bộ quy trình
        </span>
      </button>
    </div>
  );
};
