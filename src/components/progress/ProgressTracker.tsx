import React from 'react';
import { CheckCircle2, PlayCircle, Circle, RefreshCw, Check } from 'lucide-react';
import type { ProcessStep, N8nResponse } from '../../types';

interface ProgressTrackerProps {
  steps: ProcessStep[];
  currentStepIndex?: number;
  isProcessing: boolean;
  logs: string[];
  jobId?: string;
  n8nResponse?: N8nResponse | null;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  steps,
  isProcessing,
  jobId = 'JOB-0001_DAC-NHAN-TAM',
  n8nResponse
}) => {
  const getStepTime = (idx: number) => {
    const baseHour = 14;
    const baseMin = 25 + Math.floor(idx * 0.4);
    return `${baseHour}:${String(baseMin).padStart(2, '0')}`;
  };

  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progressPercent = Math.min(100, Math.round((completedCount / steps.length) * 100));

  return (
    <div className="flex flex-col justify-between space-y-3.5 h-full">
      {/* 1. Progress Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3.5 hover:border-indigo-200 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
              Tiến trình tạo video
            </h3>
            <span className="text-[11px] font-mono text-indigo-600 font-bold">
              {n8nResponse?.job_id || jobId}
            </span>
          </div>

          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isProcessing
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Đang xử lý...' : 'Sẵn sàng'}</span>
          </span>
        </div>

        {/* Mini Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Tiến độ hoàn tất</span>
            <span className="text-indigo-600">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Vertical Step Timeline */}
        <div className="space-y-2 pt-1">
          {steps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isRunning = step.status === 'running';

            return (
              <div
                key={step.id}
                className="flex items-center justify-between text-xs py-0.5 group"
              >
                <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 fill-emerald-100" />
                  ) : isRunning ? (
                    <PlayCircle className="w-4 h-4 text-indigo-600 animate-pulse flex-shrink-0 fill-indigo-100" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  )}

                  <span
                    className={`truncate text-xs ${
                      isRunning
                        ? 'text-indigo-700 font-extrabold'
                        : isCompleted
                        ? 'text-slate-800 font-semibold'
                        : 'text-slate-400 font-normal'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-slate-400 font-medium flex-shrink-0">
                  {isCompleted || isRunning ? step.timestamp || getStepTime(idx) : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Sau khi hoàn thành card */}
      <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 text-xs text-slate-800 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 font-extrabold text-emerald-900 text-sm">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
            <span>Sau khi hoàn thành</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
            Tự động 100%
          </span>
        </div>

        <ul className="space-y-1.5 text-[11px] text-slate-700 leading-relaxed font-medium">
          <li className="flex items-start space-x-1.5">
            <span className="text-emerald-600 font-bold">•</span>
            <span>Video sẽ được lưu vào <strong>Google Drive</strong></span>
          </li>
          <li className="flex items-start space-x-1.5">
            <span className="text-emerald-600 font-bold">•</span>
            <span>Tạo thư mục riêng theo mã job <strong>{jobId}</strong></span>
          </li>
          <li className="flex items-start space-x-1.5">
            <span className="text-emerald-600 font-bold">•</span>
            <span>Đầy đủ 6 file: ảnh, video, storyboard, caption</span>
          </li>
          <li className="flex items-start space-x-1.5">
            <span className="text-emerald-600 font-bold">•</span>
            <span>Bạn chỉ cần mở Drive và tải video về</span>
          </li>
          <li className="flex items-start space-x-1.5">
            <span className="text-emerald-600 font-bold">•</span>
            <span>Đăng TikTok/Reels/Shorts vào khung giờ vàng</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
