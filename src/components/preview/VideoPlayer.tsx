import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Sparkles, BookOpen, ShoppingBag } from 'lucide-react';
import type { UploadedMedia } from '../../types';

interface VideoPlayerProps {
  isCompleted: boolean;
  isProcessing: boolean;
  bookImage: UploadedMedia | null;
  kolImage: UploadedMedia | null;
  activeTime: number;
  onTimeChange: (time: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  bookImage,
  kolImage,
  activeTime,
  onTimeChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const currentTimeRef = useRef<number>(activeTime);

  useEffect(() => {
    currentTimeRef.current = activeTime;
  }, [activeTime]);

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      let nextTime = currentTimeRef.current + delta;
      if (nextTime >= 6) {
        nextTime = 0;
      }
      currentTimeRef.current = nextTime;
      onTimeChange(nextTime);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, onTimeChange]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    onTimeChange(0);
    currentTimeRef.current = 0;
    setIsPlaying(true);
  };

  const kolSrc = kolImage?.previewUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
  const bookSrc = bookImage?.previewUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="relative w-full max-w-[210px] sm:max-w-[230px] aspect-[9/16] bg-slate-950 rounded-[28px] p-2 overflow-hidden shadow-2xl border-[3px] border-slate-800 ring-1 ring-white/20 flex flex-col justify-between group select-none">
      
      {/* Dynamic Island Notch Pill */}
      <div className="absolute top-3 inset-x-0 z-30 flex justify-center pointer-events-none">
        <div className="w-20 h-4 bg-black rounded-full border border-white/10 flex items-center justify-between px-2 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          <span className="w-2 h-2 rounded-full bg-indigo-500/80 animate-pulse" />
        </div>
      </div>

      {/* Internal Screen Container */}
      <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-black flex flex-col justify-between">
        
        {/* Dynamic Scene Rendering based on activeTime (0 to 6s) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Background image shifts dynamically */}
          <img
            src={activeTime >= 1 && activeTime < 2 ? bookSrc : kolSrc}
            alt="Video Scene"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          
          {/* Subtle Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

          {/* SCENE 1: 0 - 1s (Hook) */}
          {activeTime < 1 && (
            <div className="absolute top-10 left-2.5 right-2.5 space-y-1 animate-fadeIn">
              <span className="inline-flex items-center space-x-1 bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
                <Sparkles className="w-2.5 h-2.5" />
                <span>TOP 1 SÁCH BÁN CHẠY</span>
              </span>
              <h4 className="text-white text-xs sm:text-[13px] font-black leading-tight drop-shadow-lg">
                Cuốn sách <span className="text-amber-300">thay đổi</span> <br />
                <span className="text-rose-400">tư duy & cuộc đời</span>
              </h4>
            </div>
          )}

          {/* SCENE 2: 1 - 2s (Book intro) */}
          {activeTime >= 1 && activeTime < 2 && (
            <div className="absolute inset-x-2.5 bottom-16 bg-black/75 backdrop-blur-md p-2.5 rounded-xl border border-white/20 text-white space-y-1 animate-fadeIn">
              <div className="flex items-center space-x-1 text-amber-400 text-[10px] font-extrabold">
                <BookOpen className="w-3 h-3" />
                <span>SIÊU PHẨM KINH ĐIỂN</span>
              </div>
              <h5 className="font-black text-xs text-white">ĐẮC NHÂN TÂM</h5>
              <p className="text-[9px] text-slate-300 leading-tight">
                Nghệ thuật thu phục lòng người & kết nối đỉnh cao.
              </p>
            </div>
          )}

          {/* SCENE 3: 2 - 4s (KOL sharing) */}
          {activeTime >= 2 && activeTime < 4 && (
            <div className="absolute inset-x-2.5 bottom-16 bg-black/75 backdrop-blur-md p-2.5 rounded-xl border border-white/20 text-white space-y-1 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-indigo-300 text-[9px] font-black uppercase tracking-wider">KOL REVIEW</span>
                <span className="flex space-x-0.5">
                  <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                </span>
              </div>
              <p className="text-[10px] text-slate-100 font-medium leading-tight">
                "Đọc xong mình áp dụng ngay vào giao tiếp và thấy công việc thăng tiến rõ rệt!"
              </p>
            </div>
          )}

          {/* SCENE 4: 4 - 5s (Key Highlights) */}
          {activeTime >= 4 && activeTime < 5 && (
            <div className="absolute inset-x-2.5 bottom-16 bg-indigo-950/80 backdrop-blur-md p-2.5 rounded-xl border border-indigo-400/40 text-white space-y-1 animate-fadeIn">
              <span className="text-amber-300 text-[9px] font-black uppercase">⭐ ĐIỂM NỔI BẬT</span>
              <ul className="text-[9px] text-slate-200 font-medium space-y-0.5">
                <li>✓ 6 cách tạo thiện cảm tức thì</li>
                <li>✓ Bí quyết thuyết phục người khác</li>
              </ul>
            </div>
          )}

          {/* SCENE 5: 5 - 6s (CTA) */}
          {activeTime >= 5 && (
            <div className="absolute inset-x-2.5 bottom-16 bg-gradient-to-r from-rose-600 to-indigo-600 p-2.5 rounded-xl text-white text-center space-y-1 shadow-lg animate-pulse">
              <div className="flex items-center justify-center space-x-1 text-[11px] font-black uppercase">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>MUA NGAY TRÊN TIKTOK SHOP</span>
              </div>
              <p className="text-[9px] text-pink-100 font-medium">Ưu đãi độc quyền hôm nay!</p>
            </div>
          )}
        </div>

        {/* Top Mini Bar */}
        <div className="relative z-20 flex items-center justify-between p-2 pt-6 text-white text-[10px]">
          <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs font-mono font-bold text-amber-300">
            00:0{Math.floor(activeTime)} / 00:06
          </span>
          <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs font-bold text-slate-300 text-[9px]">
            9:16 HD
          </span>
        </div>

        {/* Center Play/Pause Floating Overlay */}
        <div 
          onClick={togglePlay}
          className="relative z-20 flex-1 flex items-center justify-center cursor-pointer"
        >
          {!isPlaying && (
            <div className="w-12 h-12 rounded-full bg-white/90 text-slate-950 flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
            </div>
          )}
        </div>

        {/* Bottom Interactive Controls */}
        <div className="relative z-20 p-2.5 bg-gradient-to-t from-black/95 via-black/80 to-transparent space-y-1.5">
          {/* Scrubber Bar */}
          <div 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              onTimeChange(ratio * 6);
            }}
            className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer overflow-hidden relative"
          >
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
              style={{ width: `${(activeTime / 6) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-white text-[11px] pt-0.5">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={togglePlay}
                className="hover:text-cyan-400 transition-colors p-1"
                title={isPlaying ? 'Tạm dừng' : 'Phát'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="hover:text-cyan-400 transition-colors p-1"
                title="Xem lại từ đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="hover:text-cyan-400 transition-colors p-1"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => alert('Phóng to chế độ toàn màn hình 1080x1920 HD')}
                className="hover:text-cyan-400 transition-colors p-1"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
