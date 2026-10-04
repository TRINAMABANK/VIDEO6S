import React from 'react';
import type { StoryboardScene } from '../../types';

interface StoryboardTimelineProps {
  storyboard: StoryboardScene[];
  currentTime: number;
  onSelectScene?: (startTime: number) => void;
  kolThumbnail?: string;
  bookThumbnail?: string;
}

const DEFAULT_STORYBOARD_ITEMS = [
  {
    time: '0–1s',
    title: 'Hook',
    desc: 'KOL mỉm cười, cầm sách và nhìn vào camera',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  {
    time: '1–2s',
    title: 'Giới thiệu sách',
    desc: 'Giới thiệu sách, zoom cận bìa',
    img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=120&q=80'
  },
  {
    time: '2–4s',
    title: 'KOL tương tác',
    desc: 'KOL chia sẻ ngắn về lợi ích',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  {
    time: '4–5s',
    title: 'Điểm nổi bật',
    desc: 'Text nổi bật + hiệu ứng động',
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=120&q=80'
  },
  {
    time: '5–6s',
    title: 'CTA',
    desc: 'Khuyến khích đọc sách',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  }
];

export const StoryboardTimeline: React.FC<StoryboardTimelineProps> = ({
  currentTime,
  onSelectScene,
  kolThumbnail,
  bookThumbnail
}) => {
  const getStartTime = (timeStr: string) => {
    if (timeStr.startsWith('0')) return 0.5;
    if (timeStr.startsWith('1')) return 1.5;
    if (timeStr.startsWith('2')) return 2.5;
    if (timeStr.startsWith('4')) return 4.5;
    return 5.5;
  };

  const isActive = (timeStr: string, current: number) => {
    if (timeStr.includes('0–1s') && current < 1) return true;
    if (timeStr.includes('1–2s') && current >= 1 && current < 2) return true;
    if (timeStr.includes('2–4s') && current >= 2 && current < 4) return true;
    if (timeStr.includes('4–5s') && current >= 4 && current < 5) return true;
    if (timeStr.includes('5–6s') && current >= 5) return true;
    return false;
  };

  return (
    <div className="flex flex-col justify-between space-y-2 h-full">
      <div className="text-xs font-bold text-slate-700 pb-1">
        Storyboard (Mẫu)
      </div>

      <div className="space-y-2 flex-1">
        {DEFAULT_STORYBOARD_ITEMS.map((item, idx) => {
          const active = isActive(item.time, currentTime);
          const imgSrc = idx === 1 ? (bookThumbnail || item.img) : (kolThumbnail || item.img);

          return (
            <div
              key={idx}
              onClick={() => onSelectScene?.(getStartTime(item.time))}
              className={`flex items-center space-x-2.5 p-1.5 rounded-xl border transition-all cursor-pointer ${
                active
                  ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-200 shadow-sm'
                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/60'
              }`}
            >
              <img
                src={imgSrc}
                alt={item.title}
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-200 shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-[11px] text-slate-900 font-mono">
                    {item.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-1 leading-tight mt-0.5">
                  <span className="font-bold">{item.title}: </span>
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
