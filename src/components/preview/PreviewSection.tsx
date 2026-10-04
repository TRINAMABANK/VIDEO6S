import React, { useState } from 'react';
import { Eye, Sparkles } from 'lucide-react';
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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col justify-between h-full hover:border-indigo-200 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-xs">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
              Xem trước kết quả
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>AI Render 6s</span>
          </span>
        </div>
      </div>

      {/* Grid: 9:16 Video Player on Left, Storyboard list on Right */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start pt-3.5 flex-1">
        <div className="sm:col-span-6 flex justify-center">
          <VideoPlayer
            isCompleted={isCompleted}
            isProcessing={isProcessing}
            bookImage={bookImage}
            kolImage={kolImage}
            activeTime={activePlaybackTime}
            onTimeChange={(t) => setActivePlaybackTime(t)}
          />
        </div>

        <div className="sm:col-span-6 h-full flex flex-col justify-between">
          <StoryboardTimeline
            storyboard={storyboard}
            currentTime={activePlaybackTime}
            onSelectScene={(time) => setActivePlaybackTime(time)}
            kolThumbnail={kolImage?.previewUrl || undefined}
            bookThumbnail={bookImage?.previewUrl || undefined}
          />
        </div>
      </div>
    </div>
  );
};
