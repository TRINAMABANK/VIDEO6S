import React, { useState } from 'react';
import { Eye, Smartphone, Layers } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { StoryboardTimeline } from './StoryboardTimeline';
import type { StoryboardScene, UploadedMedia } from '../../types';

interface PreviewSectionProps {
  storyboard: StoryboardScene[];
  isCompleted: boolean;
  isProcessing: boolean;
  bookImage: UploadedMedia | null;
  kolImage: UploadedMedia | null;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  storyboard,
  isCompleted,
  isProcessing,
  bookImage,
  kolImage
}) => {
  const [activePlaybackTime, setActivePlaybackTime] = useState<number>(0);

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                Xem trước kết quả
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Format 9:16 Chuẩn
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Mô phỏng chân thực kịch bản 6 giây tối ưu tỷ lệ chuyển đổi đơn hàng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
            <Smartphone className="w-3.5 h-3.5 text-brand-600" />
            <span>TikTok / Reels / Shorts</span>
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>5 Scenes</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Video Player on Left, Storyboard Timeline on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: 9:16 Video Player Container */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-50/70 p-4 sm:p-6 rounded-2xl border border-slate-100">
          <VideoPlayer
            isCompleted={isCompleted}
            isProcessing={isProcessing}
            bookImage={bookImage}
            kolImage={kolImage}
            activeTime={activePlaybackTime}
            onTimeChange={(t) => setActivePlaybackTime(t)}
          />
        </div>

        {/* Right Column: Storyboard List */}
        <div className="lg:col-span-7 space-y-4">
          <StoryboardTimeline
            storyboard={storyboard}
            currentTime={activePlaybackTime}
            onSelectScene={(time) => setActivePlaybackTime(time)}
          />
        </div>
      </div>
    </section>
  );
};
