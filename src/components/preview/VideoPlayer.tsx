import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Download, Share2, Film, CheckCircle2 } from 'lucide-react';
import type { UploadedMedia } from '../../types';

interface VideoPlayerProps {
  isCompleted: boolean;
  isProcessing: boolean;
  bookImage: UploadedMedia | null;
  kolImage: UploadedMedia | null;
  activeTime: number; // 0 to 6 in seconds
  onTimeChange?: (time: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  isCompleted,
  isProcessing,
  bookImage,
  kolImage,
  activeTime,
  onTimeChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Sync internal time with parent activeTime if passed
  useEffect(() => {
    if (activeTime !== undefined && !isPlaying) {
      setCurrentTime(activeTime);
    }
  }, [activeTime, isPlaying]);

  // Handle Playback loop (6 seconds)
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

      setCurrentTime((prev) => {
        const nextTime = prev + delta;
        if (nextTime >= 6) {
          return 0; // loop
        }
        return nextTime;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  // Notify parent of time change for storyboard highlight
  useEffect(() => {
    onTimeChange?.(currentTime);
  }, [currentTime, onTimeChange]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // Determine current active scene segment
  const getActiveSceneName = (t: number) => {
    if (t < 1) return { tag: '0–1s', name: 'HOOK', color: 'bg-amber-500' };
    if (t < 2) return { tag: '1–2s', name: 'GIỚI THIỆU SÁCH', color: 'bg-brand-500' };
    if (t < 4) return { tag: '2–4s', name: 'KOL TƯƠNG TÁC', color: 'bg-purple-500' };
    if (t < 5) return { tag: '4–5s', name: 'ĐIỂM NỔI BẬT', color: 'bg-emerald-500' };
    return { tag: '5–6s', name: 'CTA MUA NGAY', color: 'bg-rose-500' };
  };

  const currentScene = getActiveSceneName(currentTime);

  return (
    <div className="flex flex-col items-center">
      {/* 9:16 Vertical Video Container */}
      <div className="relative w-full max-w-[280px] sm:max-w-[310px] aspect-[9/16] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 ring-1 ring-slate-800/80 flex flex-col justify-between group">
        
        {/* Top Video Overlay Bar */}
        <div className="relative z-20 p-3.5 flex items-center justify-between text-white bg-gradient-to-b from-black/80 via-black/30 to-transparent">
          <div className="flex items-center space-x-1.5">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${currentScene.color}`}>
              {currentScene.tag} • {currentScene.name}
            </span>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white/90 backdrop-blur transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Video Canvas Simulation Body */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {!isCompleted && !isProcessing ? (
            /* Idle Placeholder */
            <div className="p-6 text-center text-slate-400 space-y-3 z-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-brand-400 shadow-inner">
                <Film className="w-8 h-8 opacity-80" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-200">Khung Video 9:16</p>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Tải lên ảnh sách & KOL rồi bấm tạo video để xem trước bản dựng hoàn chỉnh
                </p>
              </div>
            </div>
          ) : isProcessing ? (
            /* Generating State Animation */
            <div className="p-6 text-center text-white space-y-4 z-10 flex flex-col items-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
                <Sparkles className="w-6 h-6 text-brand-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-200 tracking-wide">ĐANG RENDER VIDEO 6S</p>
                <p className="text-[10px] text-slate-400">Khớp từng khung hình AI...</p>
              </div>
            </div>
          ) : (
            /* Completed Interactive Dynamic 6-Second Simulation */
            <div className="relative w-full h-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 select-none">
              
              {/* Dynamic Scene Overlays depending on currentTime */}
              {/* Scene 1: 0 - 1s HOOK */}
              {currentTime < 1 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center animate-fade-in">
                  <div className="relative mb-4 scale-110 transition-transform">
                    <img
                      src={bookImage?.previewUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'}
                      alt="Book Cover"
                      className="w-36 h-48 object-cover rounded-lg shadow-2xl ring-4 ring-amber-400/80 animate-pulse"
                    />
                    <div className="absolute -top-3 -right-3 bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
                      HOT TREND
                    </div>
                  </div>
                  <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-400/50">
                    <p className="text-xs font-black text-amber-300 uppercase tracking-wider">
                      ⚡ CUỐN SÁCH PHẢI ĐỌC 2026!
                    </p>
                  </div>
                </div>
              )}

              {/* Scene 2: 1 - 2s INTRO */}
              {currentTime >= 1 && currentTime < 2 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-32 h-44 rounded-lg overflow-hidden shadow-2xl border-2 border-brand-400/70 mb-3 animate-bounce">
                    <img
                      src={bookImage?.previewUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'}
                      alt="Book"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-brand-600/90 text-white px-3 py-1 rounded-lg text-xs font-extrabold shadow-lg">
                    TỰA SÁCH BÁN CHẠY NHẤT
                  </div>
                  <p className="text-[11px] text-slate-200 mt-1 font-medium bg-black/60 px-2 py-0.5 rounded">
                    Khám phá bí mật tư duy bứt phá
                  </p>
                </div>
              )}

              {/* Scene 3: 2 - 4s KOL INTERACTION */}
              {currentTime >= 2 && currentTime < 4 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="relative w-44 h-56 rounded-2xl overflow-hidden border-2 border-purple-400 shadow-2xl">
                    <img
                      src={kolImage?.previewUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                      alt="KOL"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 w-16 h-22 rounded border border-white/60 shadow-lg overflow-hidden">
                      <img
                        src={bookImage?.previewUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'}
                        alt="Mini book"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="mt-3 bg-purple-600 text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-md">
                    ⭐ KOL Review: "10/10 Rất đáng tiền!"
                  </div>
                </div>
              )}

              {/* Scene 4: 4 - 5s HIGHLIGHTS */}
              {currentTime >= 4 && currentTime < 5 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-left space-y-2">
                  <div className="w-full bg-black/75 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-400/60 space-y-2 text-white">
                    <div className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>3 LÝ DO NÊN MUA NGAY</span>
                    </div>
                    <div className="text-[11px] space-y-1 text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Áp dụng thực tế tức thì</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Tặng kèm audio tóm tắt</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Freeship toàn quốc hôm nay</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scene 5: 5 - 6s CTA */}
              {currentTime >= 5 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center space-y-3">
                  <div className="w-24 h-32 rounded-lg overflow-hidden shadow-xl border border-rose-400/80 mb-1">
                    <img
                      src={bookImage?.previewUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'}
                      alt="Book"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full bg-rose-600 text-white font-extrabold py-2.5 px-4 rounded-2xl text-xs shadow-xl animate-bounce flex items-center justify-center gap-2 cursor-pointer">
                    <span>🛒 BẤM MUA NGAY (GIẢM 30%)</span>
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium bg-black/60 px-2 py-0.5 rounded-full">
                    Ưu đãi chỉ còn trong hôm nay
                  </span>
                </div>
              )}

              {/* Play / Pause Big Center Click Overlay */}
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm hover:scale-110"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Bottom Video Controls Bar */}
        <div className="relative z-20 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-2">
          {/* Scrubber Bar */}
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="6"
              step="0.05"
              value={currentTime}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setCurrentTime(val);
              }}
              disabled={!isCompleted}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500 disabled:opacity-50"
            />
          </div>

          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={togglePlay}
                disabled={!isCompleted}
                className="p-1 rounded hover:bg-white/20 transition-colors disabled:opacity-40"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                disabled={!isCompleted}
                className="p-1 rounded hover:bg-white/20 transition-colors disabled:opacity-40"
                title="Xem lại từ đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <span className="font-mono text-[11px] text-slate-300">
                00:0{Math.floor(currentTime)} / 00:06
              </span>
            </div>

            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">
              9:16 1080p
            </span>
          </div>
        </div>
      </div>

      {/* Video Quick Action Buttons */}
      {isCompleted && (
        <div className="flex items-center gap-2 mt-3.5">
          <button
            type="button"
            onClick={() => alert('Đang chuẩn bị tải xuống 05_VIDEO_6S.mp4')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải video .MP4</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Đã sao chép liên kết chia sẻ video')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Chia sẻ</span>
          </button>
        </div>
      )}
    </div>
  );
};
