import React, { useState } from 'react';
import { HardDrive, Folder, FileImage, FileCode, Film, FileText, Download, ExternalLink, Check, Copy, Eye, X } from 'lucide-react';
import type { DriveItem } from '../../types';
import { copyToClipboard } from '../../utils/helpers';

interface DriveFolderViewerProps {
  files: DriveItem[];
  jobId?: string;
  folderPath?: string;
}

export const DriveFolderViewer: React.FC<DriveFolderViewerProps> = ({
  files,
  jobId = 'JOB-0001',
  folderPath = 'TRÍ AI VIDEO FACTORY / 2026 / 10 / JOB-0001'
}) => {
  const [selectedFile, setSelectedFile] = useState<DriveItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const getFileIcon = (type: DriveItem['type'], name: string) => {
    if (type === 'video' || name.endsWith('.mp4')) {
      return <Film className="w-5 h-5 text-purple-600" />;
    }
    if (type === 'json' || name.endsWith('.json')) {
      return <FileCode className="w-5 h-5 text-amber-600" />;
    }
    if (type === 'text' || name.endsWith('.txt')) {
      return <FileText className="w-5 h-5 text-brand-600" />;
    }
    return <FileImage className="w-5 h-5 text-emerald-600" />;
  };

  const handleCopyFolderPath = async () => {
    const ok = await copyToClipboard(folderPath);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAction = (fileName: string) => {
    alert(`[Mô phỏng Drive] Đang mở tệp: ${fileName}`);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                Kết quả sẽ có trong Google Drive
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Auto Sync 100%
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Toàn bộ source assets, storyboard, video thành phẩm & caption tự động lưu trữ có cấu trúc
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyFolderPath}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Đã sao chép path' : 'Sao chép đường dẫn'}</span>
          </button>

          <button
            type="button"
            onClick={() => alert('Mở Google Drive mô phỏng (Tính năng UI Demo)')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Mở Drive</span>
          </button>
        </div>
      </div>

      {/* Folder Path Breadcrumb Bar */}
      <div className="bg-slate-900 text-slate-200 p-3.5 sm:p-4 rounded-2xl flex items-center justify-between font-mono text-xs overflow-x-auto">
        <div className="flex items-center space-x-2 text-slate-300 whitespace-nowrap">
          <Folder className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="font-bold text-amber-400">TRÍ AI VIDEO FACTORY</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300">2026</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300">10</span>
          <span className="text-slate-600">/</span>
          <span className="text-emerald-400 font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {jobId}
          </span>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline-block ml-4 flex-shrink-0">
          6/6 Tệp đồng bộ
        </span>
      </div>

      {/* 6 Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {files.map((file, idx) => (
          <div
            key={idx}
            className="group relative bg-slate-50 hover:bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-brand-300 hover:shadow-card transition-all duration-200 flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm transition-colors">
                  {getFileIcon(file.type, file.name)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-brand-700">
                    {file.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>{file.updatedAt}</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 flex-shrink-0">
                Synced
              </span>
            </div>

            {file.description && (
              <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                {file.description}
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setSelectedFile(file)}
                className="inline-flex items-center space-x-1 text-slate-600 hover:text-brand-600 font-semibold transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem trước</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction(file.name)}
                className="inline-flex items-center space-x-1 text-slate-600 hover:text-slate-900 font-medium p-1 rounded hover:bg-slate-100 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px]">Tải</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* File Quick Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                {getFileIcon(selectedFile.type, selectedFile.name)}
                <h4 className="font-bold text-sm text-slate-900">{selectedFile.name}</h4>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between text-slate-500">
                <span>Dung lượng:</span>
                <span className="font-mono font-bold text-slate-800">{selectedFile.size}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Trạng thái:</span>
                <span className="font-bold text-emerald-600">Đã lưu trữ an toàn trên Google Drive</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Thư mục:</span>
                <span className="font-mono text-slate-700">/{folderPath}</span>
              </div>
              <p className="text-slate-600 pt-2 border-t border-slate-200 italic">
                {selectedFile.description}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  alert(`Tải tệp ${selectedFile.name}`);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải xuống tệp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
