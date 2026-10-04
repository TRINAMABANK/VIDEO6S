import React from 'react';
import { Image, Bot, Sparkles, Play, CheckCircle2, HardDrive, ChevronRight } from 'lucide-react';

interface ProcessWorkflowProps {
  currentStepIndex?: number;
  isProcessing?: boolean;
}

const STEPS = [
  { id: 1, title: 'Upload sách + KOL', desc: 'Nhận 2 file ảnh', icon: Image, color: 'from-blue-500 to-indigo-600' },
  { id: 2, title: 'AI phân tích & storyboard', desc: 'Lên kịch bản 6s', icon: Bot, color: 'from-indigo-500 to-purple-600' },
  { id: 3, title: 'Tạo ảnh quảng cáo', desc: 'Key Visual HD', icon: Sparkles, color: 'from-purple-500 to-pink-600' },
  { id: 4, title: 'Tạo video 6 giây', desc: 'Render 9:16', icon: Play, color: 'from-blue-600 to-cyan-500' },
  { id: 5, title: 'Kiểm tra chất lượng', desc: 'Duyệt âm & hình', icon: CheckCircle2, color: 'from-emerald-500 to-teal-600' },
  { id: 6, title: 'Lưu vào Google Drive', desc: 'Tự động đồng bộ', icon: HardDrive, color: 'from-amber-500 to-orange-600' }
];

export const ProcessWorkflow: React.FC<ProcessWorkflowProps> = ({
  currentStepIndex = 4,
  isProcessing = false
}) => {
  return (
    <div className="w-full flex items-center justify-between overflow-x-auto py-1.5 scrollbar-none select-none">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isCompleted = !isProcessing && currentStepIndex >= 7
          ? true
          : (isProcessing && Math.floor((currentStepIndex / 8) * 6) > idx) || (idx < 4);
        const isActive = isProcessing && Math.floor((currentStepIndex / 8) * 6) === idx;

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center space-x-3 min-w-[120px] sm:min-w-[160px] group">
              <div className="relative flex-shrink-0">
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-tr ${step.color} text-white ring-4 ring-indigo-200/80 scale-110 shadow-lg shadow-indigo-500/30 animate-pulse`
                      : isCompleted
                      ? `bg-gradient-to-tr ${step.color} text-white shadow-md shadow-indigo-500/15`
                      : 'bg-slate-100 text-slate-400 border border-slate-200/80'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                
                {/* Step number badge */}
                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-[#070A13] text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm">
                  {step.id}
                </span>
              </div>

              <div className="flex flex-col text-left">
                <span className={`text-xs font-black tracking-tight leading-tight ${
                  isActive ? 'text-indigo-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {step.title}
                </span>
                <span className="text-[10px] font-medium text-slate-500 leading-tight hidden sm:inline">
                  {step.desc}
                </span>
              </div>
            </div>

            {idx < STEPS.length - 1 && (
              <div className="flex justify-center items-center px-1 text-slate-300 flex-shrink-0">
                <ChevronRight className="w-4 h-4 text-slate-300 stroke-[2.5]" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
