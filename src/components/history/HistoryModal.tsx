import React from 'react';
import { History, X, Film, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import type { GenerationJob } from '../../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyJobs: GenerationJob[];
  onSelectJob: (job: GenerationJob) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  historyJobs,
  onSelectJob
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Lịch sử tạo video</h3>
              <p className="text-xs text-slate-500">Danh sách các video đã tạo trong phiên làm việc</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
          {historyJobs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Film className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
              <p className="text-sm font-semibold">Chưa có video nào trong lịch sử</p>
              <p className="text-xs text-slate-400">Hãy upload ảnh và bấm tạo video để lưu kết quả tại đây.</p>
            </div>
          ) : (
            historyJobs.map((job) => (
              <div
                key={job.jobId}
                onClick={() => {
                  onSelectJob(job);
                  onClose();
                }}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-brand-50/50 border border-slate-200 hover:border-brand-300 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center overflow-hidden flex-shrink-0">
                    {job.bookImage?.previewUrl ? (
                      <img src={job.bookImage.previewUrl} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <Film className="w-6 h-6 text-brand-400" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-800">
                        {job.jobId}
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[200px]">
                        {job.bookImage?.name || 'Sách Chưa Đặt Tên'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{job.createdAt.toLocaleTimeString()} - {job.createdAt.toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Đã hoàn tất
                      </span>
                    </div>
                  </div>
                </div>

                <button className="p-2 rounded-xl text-slate-400 group-hover:text-brand-600 group-hover:bg-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
