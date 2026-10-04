import React from 'react';
import type { StoryboardScene } from '../../types';
import { Zap, BookOpen, Users, Star, ShoppingBag, Eye } from 'lucide-react';

interface StoryboardTimelineProps {
  storyboard: StoryboardScene[];
  currentTime: number;
  onSelectScene?: (startTime: number) => void;
}

const SCENE_ICONS: Record<string, React.ElementType> = {
  hook: Zap,
  intro: BookOpen,
  kol_interaction: Users,
  highlights: Star,
  cta: ShoppingBag
};

export const StoryboardTimeline: React.FC<StoryboardTimelineProps> = ({
  storyboard,
  currentTime,
  onSelectScene
}) => {
  const getSceneStartTime = (timeRange: string): number => {
    if (timeRange.startsWith('0')) return 0.5;
    if (timeRange.startsWith('1')) return 1.5;
    if (timeRange.startsWith('2')) return 2.5;
    if (timeRange.startsWith('4')) return 4.5;
    if (timeRange.startsWith('5')) return 5.5;
    return 0;
  };

  const isSceneActive = (timeRange: string, current: number): boolean => {
    if (timeRange.includes('0–1s') && current < 1) return true;
    if (timeRange.includes('1–2s') && current >= 1 && current < 2) return true;
    if (timeRange.includes('2–4s') && current >= 2 && current < 4) return true;
    if (timeRange.includes('4–5s') && current >= 4 && current < 5) return true;
    if (timeRange.includes('5–6s') && current >= 5) return true;
    return false;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-600"></span>
          <h4 className="font-bold text-sm text-slate-800">
            Storyboard 5 phân cảnh (Cấu trúc Viral 6s)
          </h4>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          Click vào cảnh để nhảy thời gian
        </span>
      </div>

      <div className="space-y-2.5">
        {storyboard.map((scene) => {
          const Icon = SCENE_ICONS[scene.sceneType] || Zap;
          const active = isSceneActive(scene.timeRange, currentTime);
          const startTime = getSceneStartTime(scene.timeRange);

          return (
            <div
              key={scene.id}
              onClick={() => onSelectScene?.(startTime)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                active
                  ? 'bg-gradient-to-r from-brand-50/90 via-white to-purple-50/50 border-brand-400 ring-2 ring-brand-300 shadow-sm'
                  : 'bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-slate-300'
              }`}
            >
              {/* Active left indicator accent bar */}
              {active && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-600 to-purple-600" />
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3">
                  {/* Icon badge */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform group-hover:scale-105 ${
                      active
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {scene.timeRange}
                      </span>
                      <span className="font-bold text-sm text-slate-900">
                        {scene.title}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {scene.description}
                    </p>

                    {/* Camera / AI Prompt meta tag */}
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        📹 Camera: {scene.cameraMovement}
                      </span>
                      {active && (
                        <span className="inline-flex items-center text-[10px] font-bold text-brand-700 bg-brand-100/70 px-2 py-0.5 rounded animate-pulse">
                          ▶ Đang phát phân cảnh này
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[11px] font-semibold text-brand-600 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    Xem
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
