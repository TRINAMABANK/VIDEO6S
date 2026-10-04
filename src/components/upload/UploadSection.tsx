import React from 'react';
import { Wand2, Sparkles, ArrowRight } from 'lucide-react';
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
    <div className="flex flex-col justify-between space-y-3.5 h-full">
      {/* 2 Upload Cards Side by Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
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

      {/* Main High-Tech Masterclass CTA Button */}
      <button
        type="button"
        onClick={onStartGenerate}
        disabled={!isReady || isProcessing}
        className={`relative group w-full py-4 px-6 rounded-2xl font-black flex flex-col items-center justify-center transition-all duration-300 overflow-hidden ${
          isReady && !isProcessing
            ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.01] active:scale-[0.99] cursor-pointer animate-sweep'
            : isProcessing
            ? 'bg-slate-900 text-white cursor-wait border border-white/10'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/70 shadow-none'
        }`}
      >
        <div className="flex items-center space-x-2.5 text-base sm:text-[17px] font-black tracking-wide">
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Wand2 className="w-5 h-5 text-pink-300 group-hover:rotate-12 transition-transform" />
          )}
          <span className="uppercase">
            {isProcessing ? 'Đang Xử Lý Quy Trình...' : '🚀 TẠO VIDEO 6 GIÂY NGAY'}
          </span>
          {!isProcessing && isReady && (
            <ArrowRight className="w-4 h-4 text-pink-200 group-hover:translate-x-1 transition-transform" />
          )}
        </div>

        <span className="text-[11px] font-medium mt-0.5 text-white/85 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Hệ thống sẽ tự động chạy toàn bộ quy trình</span>
        </span>
      </button>
    </div>
  );
};
