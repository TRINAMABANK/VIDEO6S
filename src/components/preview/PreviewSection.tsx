import React, { useState } from 'react';
import { Video } from 'lucide-react';
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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-sm sm:text-base text-slate-900">
          Xem trước kết quả (Mẫu)
        </h3>
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Video className="w-3.5 h-3.5" />
          <span>Video mẫu</span>
        </span>
      </div>

      {/* Grid: 9:16 Video Player on Left, Storyboard list on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-3 flex-1">
        <div className="md:col-span-6 flex justify-center">
          <VideoPlayer
            isCompleted={isCompleted}
            isProcessing={isProcessing}
            bookImage={bookImage}
            kolImage={kolImage}
            activeTime={activePlaybackTime}
            onTimeChange={(t) => setActivePlaybackTime(t)}
          />
        </div>

        <div className="md:col-span-6 h-full">
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
