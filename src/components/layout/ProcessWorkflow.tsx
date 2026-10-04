import React from 'react';
import { UploadCloud, BrainCircuit, Image as ImageIcon, Film, CheckCircle2, HardDrive } from 'lucide-react';
import { DEFAULT_WORKFLOW_STEPS } from '../../constants/mockData';

interface ProcessWorkflowProps {
  currentStepIndex?: number;
  isProcessing?: boolean;
}

const STEP_ICONS = [
  UploadCloud,
  BrainCircuit,
  ImageIcon,
  Film,
  CheckCircle2,
  HardDrive
];

export const ProcessWorkflow: React.FC<ProcessWorkflowProps> = ({
  currentStepIndex = 0,
  isProcessing = false
}) => {
  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-slate-100 gap-2">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Pipeline Tự Động Hóa 100%
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Quy trình sản xuất video quảng cáo 6 bước
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Tự động tối ưu hóa cho TikTok & Reels</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {DEFAULT_WORKFLOW_STEPS.map((stepTitle, idx) => {
          const Icon = STEP_ICONS[idx] || CheckCircle2;
          
          // Map the 8 sub-steps to the 6 main workflow steps
          const isWorkflowActive = isProcessing && Math.floor((currentStepIndex / 8) * 6) === idx;
          const isWorkflowCompleted = !isProcessing && currentStepIndex >= 7 
            ? true 
            : (isProcessing && Math.floor((currentStepIndex / 8) * 6) > idx);

          return (
            <div
              key={idx}
              className={`relative flex flex-col p-3 rounded-xl border transition-all duration-300 ${
                isWorkflowActive
                  ? 'bg-brand-50/80 border-brand-400 ring-2 ring-brand-300 shadow-sm'
                  : isWorkflowCompleted
                  ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                  : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isWorkflowActive
                      ? 'bg-brand-600 text-white animate-bounce'
                      : isWorkflowCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isWorkflowCompleted ? '✓' : idx + 1}
                </div>
                <Icon
                  className={`w-4 h-4 ${
                    isWorkflowActive
                      ? 'text-brand-600'
                      : isWorkflowCompleted
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                />
              </div>

              <span className="text-xs font-semibold leading-snug line-clamp-2">
                {stepTitle.replace(/^\d+\.\s*/, '')}
              </span>

              {/* Progress bar line between items on desktop */}
              {idx < DEFAULT_WORKFLOW_STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300 text-xs">
                  →
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
