import React from 'react';
import type { StoryboardScene } from '../../types';
import { Layers } from 'lucide-react';

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
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    tag: 'Gây chú ý'
  },
  {
    time: '1–2s',
    title: 'Giới thiệu sách',
    desc: 'Giới thiệu sách, zoom cận bìa',
    img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=150&q=80',
    tag: 'Bìa sách 3D'
  },
  {
    time: '2–4s',
    title: 'KOL tương tác',
    desc: 'KOL chia sẻ ngắn về lợi ích',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    tag: 'Cảm nhận thật'
  },
  {
    time: '4–5s',
    title: 'Điểm nổi bật',
    desc: 'Text nổi bật + hiệu ứng động',
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=150&q=80',
    tag: 'Bullet Points'
  },
  {
    time: '5–6s',
    title: 'CTA',
    desc: 'Khuyến khích đọc sách & đặt mua',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    tag: 'Kêu gọi mua'
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
    <div className="flex flex-col justify-between space-y-2 h-full select-none">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center space-x-1.5 text-xs font-black text-slate-800 uppercase tracking-wide">
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <span>Storyboard Kịch Bản (5 Cảnh)</span>
        </div>
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
          Khung 6 Giây Chuẩn
        </span>
      </div>

      <div className="space-y-1.5 flex-1 overflow-y-auto pr-0.5">
        {DEFAULT_STORYBOARD_ITEMS.map((item, idx) => {
          const active = isActive(item.time, currentTime);
          const imgSrc = idx === 1 ? (bookThumbnail || item.img) : (kolThumbnail || item.img);

          return (
            <div
              key={idx}
              onClick={() => onSelectScene?.(getStartTime(item.time))}
              className={`flex items-center space-x-2.5 p-1.5 sm:p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                active
                  ? 'bg-indigo-50/90 border-indigo-300 ring-2 ring-indigo-400/30 shadow-sm'
                  : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100/90 hover:border-slate-300'
              }`}
            >
              {/* Thumbnail with scene number */}
              <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 shadow-2xs">
                <img
                  src={imgSrc}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[8px] font-mono font-black text-center py-0.2">
                  #{idx + 1}
                </span>
              </div>

              {/* Scene Text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-black text-indigo-950">
                    {item.time}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                    active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {item.tag}
                  </span>
                </div>

                <p className="text-[10px] text-slate-600 line-clamp-1 leading-tight mt-0.5">
                  <strong className="text-slate-800">{item.title}: </strong>
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
