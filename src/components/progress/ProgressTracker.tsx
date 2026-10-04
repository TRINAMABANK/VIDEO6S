import React, { useState } from 'react';
import { Activity, CheckCircle2, Loader2, Terminal, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import type { ProcessStep } from '../../types';

interface ProgressTrackerProps {
  steps: ProcessStep[];
  currentStepIndex: number;
  isProcessing: boolean;
  logs: string[];
  jobId?: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  steps,
  isProcessing,
  logs,
  jobId = 'JOB-0001'
}) => {
  const [showLogs, setShowLogs] = useState(true);

  // Calculate percentage
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-brand-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                Tiến trình tạo video
              </h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                {jobId}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Hệ thống xử lý đa tiến trình: AI Vision, Diffusion & Video Motion Synth
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500">Tiến độ:</span>
            <span className="ml-1.5 text-base font-extrabold text-brand-600 font-mono">
              {progressPercent}%
            </span>
          </div>

          <button
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Logs</span>
            {showLogs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-purple-600 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 8 Status Steps List */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {steps.map((step) => {
            const isCompleted = step.status === 'completed';
            const isRunning = step.status === 'running';

            return (
              <div
                key={step.id}
                className={`relative flex items-start space-x-3 p-3.5 rounded-xl border transition-all duration-300 ${
                  isRunning
                    ? 'bg-brand-50/70 border-brand-400 ring-2 ring-brand-300/60 shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
                    : 'bg-slate-50/40 border-slate-200/70 text-slate-400'
                }`}
              >
                {/* Status Indicator Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  ) : isRunning ? (
                    <div className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center animate-spin">
                      <Loader2 className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      ○
                    </div>
                  )}
                </div>

                {/* Step Label & Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold leading-tight truncate ${
                        isRunning
                          ? 'text-brand-900'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {step.description && (
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {step.description}
                    </p>
                  )}

                  {isRunning && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-semibold text-brand-700 animate-pulse">
                      <Sparkles className="w-3 h-3" />
                      <span>Đang thực thi...</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal Logs Accordion */}
      {showLogs && (
        <div className="border-t border-slate-200 bg-slate-950 text-slate-200 p-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[11px]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <span className="ml-2">Live Console Logs [n8n Automation Pipe]</span>
            </div>
            <span>Status: {isProcessing ? 'RUNNING' : completedCount === 8 ? 'DONE' : 'IDLE'}</span>
          </div>

          <div className="max-h-36 overflow-y-auto space-y-1 pr-2">
            {logs.length === 0 ? (
              <p className="text-slate-500 italic">
                Chờ khởi tạo... Bấm "🚀 TẠO VIDEO 6 GIÂY NGAY" để xem tiến trình thực thi trực tiếp.
              </p>
            ) : (
              logs.map((log, lIdx) => (
                <div key={lIdx} className="leading-relaxed text-slate-300 font-mono">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
