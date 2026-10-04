import React from 'react';
import { Image, Bot, Sparkles, Play, CheckCircle, HardDrive, ArrowRight } from 'lucide-react';

interface ProcessWorkflowProps {
  currentStepIndex?: number;
  isProcessing?: boolean;
}

const STEPS = [
  { id: 1, title: 'Upload sách + KOL', icon: Image, color: 'bg-blue-600' },
  { id: 2, title: 'AI phân tích & storyboard', icon: Bot, color: 'bg-purple-600' },
  { id: 3, title: 'Tạo ảnh quảng cáo', icon: Sparkles, color: 'bg-blue-600' },
  { id: 4, title: 'Tạo video 6 giây', icon: Play, color: 'bg-blue-600' },
  { id: 5, title: 'Kiểm tra chất lượng', icon: CheckCircle, color: 'bg-emerald-600' },
  { id: 6, title: 'Lưu vào Google Drive', icon: HardDrive, color: 'bg-amber-600' }
];

export const ProcessWorkflow: React.FC<ProcessWorkflowProps> = ({
  currentStepIndex = 0,
  isProcessing = false
}) => {
  return (
    <div className="w-full flex items-center justify-between overflow-x-auto py-2 px-1">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isCompleted = !isProcessing && currentStepIndex >= 7
          ? true
          : isProcessing && Math.floor((currentStepIndex / 8) * 6) > idx;
        const isActive = isProcessing && Math.floor((currentStepIndex / 8) * 6) === idx;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center text-center min-w-[95px] sm:min-w-[120px] group">
              <div className="relative mb-2">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : isActive
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 animate-bounce'
                      : idx === 0
                      ? 'bg-blue-500 text-white shadow-sm'
                      : idx === 1
                      ? 'bg-purple-500 text-white shadow-sm'
                      : idx === 4
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : idx === 5
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-blue-500 text-white shadow-sm'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm">
                  {isCompleted ? '✓' : step.id}
                </span>
              </div>

              <span className="text-xs font-semibold text-slate-700 leading-tight max-w-[110px]">
                {step.title}
              </span>
            </div>

            {idx < STEPS.length - 1 && (
              <div className="flex-1 flex justify-center items-center px-1 text-slate-300">
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
