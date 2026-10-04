import React from 'react';
import { ExternalLink, Folder, FileCode, FileText, Play } from 'lucide-react';
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
      label: 'Ảnh bìa sách',
      size: '850 KB',
      type: 'image',
      img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: '02_KOL.jpg',
      label: 'Ảnh KOL',
      size: '920 KB',
      type: 'image',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: '03_KEY_VISUAL.jpg',
      label: 'Key Visual HD',
      size: '1.4 MB',
      type: 'image',
      img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: '04_STORYBOARD.json',
      label: 'Storyboard JSON',
      size: '12 KB',
      type: 'json'
    },
    {
      name: '05_VIDEO_6S.mp4',
      label: 'Video 6s 9:16 HD',
      size: '14.8 MB',
      type: 'video',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: '06_CAPTION.txt',
      label: 'Caption & Hashtag',
      size: '4 KB',
      type: 'text'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col justify-between space-y-3.5 h-full hover:border-indigo-200 transition-colors select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          {/* Google Drive Logo */}
          <div className="w-6 h-6 flex items-center justify-center">
            <svg viewBox="0 0 87.3 78" className="w-5 h-5">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44A9.06 9.06 0 0 0 0 53h27.5z" fill="#00ac47"/>
              <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15z" fill="#ea4335"/>
              <path d="M43.65 25 57.4 1.2c-1.35-.8-2.9-1.2-4.5-1.2H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
              <path d="M59.8 53h27.5c0-1.55-.4-3.1-1.2-4.5L60.7 4.5c-.8-1.4-1.95-2.5-3.3-3.3z" fill="#ffba00"/>
              <path d="M73.55 76.8H27.5L13.75 53h46.05z" fill="#2684fc"/>
            </svg>
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
              Kết quả sẽ có trong Google Drive
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert('Mở thư mục mẫu trên Google Drive')}
          className="flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Mở Google Drive</span>
        </button>
      </div>

      {/* Path Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs font-mono text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 overflow-x-auto">
        <Folder className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
        <span className="font-bold truncate">{currentPath}</span>
      </div>

      {/* 6 Files Thumbnail Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-1 flex-1">
        {sampleItems.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-indigo-300 transition-all text-center group cursor-pointer hover:shadow-sm"
          >
            <div className="w-full h-18 rounded-lg overflow-hidden bg-white border border-slate-200 flex items-center justify-center relative mb-1.5 shadow-2xs group-hover:scale-105 transition-transform">
              {item.type === 'video' ? (
                <div className="relative w-full h-full">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-white text-slate-900 flex items-center justify-center shadow">
                      <Play className="w-3 h-3 fill-slate-900 ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/70 text-white font-mono text-[8px] rounded">
                    MP4
                  </span>
                </div>
              ) : item.type === 'image' ? (
                <div className="relative w-full h-full">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/70 text-white font-mono text-[8px] rounded">
                    JPG
                  </span>
                </div>
              ) : item.type === 'json' ? (
                <div className="flex flex-col items-center justify-center text-amber-600">
                  <FileCode className="w-7 h-7 stroke-[1.5]" />
                  <span className="text-[9px] font-mono font-bold mt-0.5">JSON</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-blue-600">
                  <FileText className="w-7 h-7 stroke-[1.5]" />
                  <span className="text-[9px] font-mono font-bold mt-0.5">TXT</span>
                </div>
              )}
            </div>

            <div className="w-full text-left space-y-0.5">
              <span className="font-mono text-[10px] font-bold text-slate-900 truncate block">
                {item.name}
              </span>
              <div className="flex items-center justify-between text-[9px] text-slate-500">
                <span>{item.size}</span>
                <span className="text-indigo-600 font-semibold">{item.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
