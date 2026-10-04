import React from 'react';
import { CheckCircle2, PlayCircle, Circle, RefreshCw, Check } from 'lucide-react';
import type { ProcessStep, N8nResponse } from '../../types';

interface ProgressTrackerProps {
  steps: ProcessStep[];
  currentStepIndex: number;
  isProcessing: boolean;
  logs: string[];
  jobId?: string;
  n8nResponse?: N8nResponse | null;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  steps,
  isProcessing
}) => {
  // Generate mock/real timestamps like 14:25, 14:26
  const getStepTime = (idx: number) => {
    const baseHour = 14;
    const baseMin = 25 + Math.floor(idx * 0.4);
    return `${baseHour}:${String(baseMin).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col space-y-4 h-full justify-between">
      {/* 1. Progress Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-sm sm:text-base text-slate-900">
            Tiến trình tạo video
          </h3>
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700">
            <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Đang xử lý...' : 'Sẵn sàng'}</span>
          </span>
        </div>

        {/* Vertical Step Timeline */}
        <div className="space-y-3">
          {steps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isRunning = step.status === 'running';

            return (
              <div
                key={step.id}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : isRunning ? (
                    <PlayCircle className="w-4 h-4 text-purple-600 animate-pulse flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  )}

                  <span
                    className={`truncate ${
                      isRunning
                        ? 'text-purple-700 font-bold'
                        : isCompleted
                        ? 'text-slate-800 font-medium'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-slate-400 flex-shrink-0">
                  {isCompleted || isRunning ? step.timestamp || getStepTime(idx) : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Sau khi hoàn thành card */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-xs text-slate-800 space-y-2.5">
        <div className="flex items-center space-x-1.5 font-bold text-emerald-800 text-sm">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Sau khi hoàn thành</span>
        </div>

        <ul className="space-y-1.5 text-[11px] text-slate-700 leading-relaxed list-disc list-inside">
          <li>Video sẽ được lưu vào Google Drive</li>
          <li>Tạo thư mục riêng cho từng job</li>
          <li>Đầy đủ file: ảnh, video, storyboard, caption</li>
          <li>Bạn chỉ cần mở Drive và tải video về</li>
          <li>Đăng TikTok thủ công vào buổi tối</li>
        </ul>
      </div>
    </div>
  );
};
