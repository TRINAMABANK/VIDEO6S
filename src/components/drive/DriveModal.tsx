import React from 'react';
import { HardDrive, X, Folder, FileImage, Film, FileText, ExternalLink, Download } from 'lucide-react';
import type { DriveItem } from '../../types';

interface DriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: DriveItem[];
  jobId?: string;
}

export const DriveModal: React.FC<DriveModalProps> = ({
  isOpen,
  onClose,
  files,
  jobId = 'JOB-0001'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Thư viện Google Drive</h3>
              <p className="text-xs text-slate-500">Toàn bộ cây thư mục và file sinh tự động theo chuẩn TRÍ AI FACTORY</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tree Path View */}
        <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs space-y-1.5 border border-slate-800">
          <div className="flex items-center space-x-2 text-amber-400">
            <Folder className="w-4 h-4" />
            <span className="font-bold">TRÍ AI VIDEO FACTORY /</span>
          </div>
          <div className="pl-4 flex items-center space-x-2 text-slate-400">
            <Folder className="w-3.5 h-3.5" />
            <span>└── 2026 /</span>
          </div>
          <div className="pl-8 flex items-center space-x-2 text-slate-400">
            <Folder className="w-3.5 h-3.5" />
            <span>└── 10 /</span>
          </div>
          <div className="pl-12 flex items-center space-x-2 text-emerald-400 font-bold">
            <Folder className="w-3.5 h-3.5" />
            <span>└── {jobId} / (Current Job)</span>
          </div>
        </div>

        {/* Files Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
          <div className="bg-slate-100 p-3 font-bold text-slate-700 grid grid-cols-12 gap-2">
            <span className="col-span-6">Tên tệp</span>
            <span className="col-span-2">Dung lượng</span>
            <span className="col-span-2">Trạng thái</span>
            <span className="col-span-2 text-right">Thao tác</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
            {files.map((f, idx) => (
              <div key={idx} className="p-3 grid grid-cols-12 gap-2 items-center hover:bg-slate-50 transition-colors">
                <div className="col-span-6 flex items-center space-x-2 font-mono text-slate-800 truncate">
                  {f.name.endsWith('.mp4') ? <Film className="w-4 h-4 text-purple-600 flex-shrink-0" /> :
                   f.name.endsWith('.txt') ? <FileText className="w-4 h-4 text-brand-600 flex-shrink-0" /> :
                   <FileImage className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                  <span className="truncate">{f.name}</span>
                </div>
                <div className="col-span-2 text-slate-500 font-mono">{f.size}</div>
                <div className="col-span-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Synced
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <button
                    onClick={() => alert(`Tải xuống: ${f.name}`)}
                    className="p-1 rounded text-slate-500 hover:text-brand-600 hover:bg-slate-100"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">
            Tổng dung lượng folder: ~16.1 MB
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              Đóng
            </button>
            <button
              onClick={() => alert('Mở Drive thư mục gốc')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem trên Google Drive</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
