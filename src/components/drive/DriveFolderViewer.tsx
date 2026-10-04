import React from 'react';
import { HardDrive, ExternalLink, Folder, FileCode, FileText, Play } from 'lucide-react';
import type { DriveItem } from '../../types';

interface DriveFolderViewerProps {
  files: DriveItem[];
  jobId?: string;
  folderPath?: string;
}

export const DriveFolderViewer: React.FC<DriveFolderViewerProps> = ({
  jobId = 'JOB-0001_DAC-NHAN-TAM',
  folderPath
}) => {
  const currentPath = folderPath || `TRÍ AI VIDEO FACTORY / 2026 / 10 / ${jobId}`;

  const sampleItems = [
    {
      name: '01_BOOK.jpg',
      type: 'image',
      img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: '02_KOL.jpg',
      type: 'image',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: '03_KEY_VISUAL.jpg',
      type: 'image',
      img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: '04_STORYBOARD.json',
      type: 'json'
    },
    {
      name: '05_VIDEO_6S.mp4',
      type: 'video',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: '06_CAPTION.txt',
      type: 'text'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col justify-between space-y-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center">
            <HardDrive className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900">
            Kết quả sẽ có trong Google Drive
          </h3>
        </div>

        <button
          type="button"
          onClick={() => alert('Mở thư mục mẫu Google Drive')}
          className="flex items-center space-x-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Xem thư mục mẫu</span>
        </button>
      </div>

      {/* Path Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs font-mono text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 overflow-x-auto">
        <Folder className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <span className="font-semibold truncate">{currentPath}</span>
      </div>

      {/* 6 Files Thumbnail Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-1">
        {sampleItems.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-colors text-center group cursor-pointer"
          >
            <div className="w-14 h-16 rounded-lg overflow-hidden bg-white border border-slate-200 flex items-center justify-center relative mb-1.5 shadow-sm">
              {item.type === 'video' ? (
                <div className="relative w-full h-full">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>
              ) : item.type === 'json' ? (
                <div className="w-full h-full bg-purple-50 flex flex-col items-center justify-center text-purple-600">
                  <FileCode className="w-6 h-6" />
                  <span className="text-[9px] font-bold mt-0.5">JSON</span>
                </div>
              ) : item.type === 'text' ? (
                <div className="w-full h-full bg-blue-50 flex flex-col items-center justify-center text-blue-600">
                  <FileText className="w-6 h-6" />
                  <span className="text-[9px] font-bold mt-0.5">TXT</span>
                </div>
              ) : (
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
              )}
            </div>

            <span className="text-[10px] font-medium text-slate-700 font-mono truncate w-full">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
