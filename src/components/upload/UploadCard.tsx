import React, { useRef, useState } from 'react';
import { Upload, X, BookOpen, User, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import type { UploadedMedia } from '../../types';

interface UploadCardProps {
  title: string;
  mediaType: 'book' | 'kol';
  uploadedMedia: UploadedMedia | null;
  onFileSelect: (media: UploadedMedia) => void;
  onRemove: () => void;
  sampleImages?: { name: string; url: string; label: string }[];
  disabled?: boolean;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  title,
  mediaType,
  uploadedMedia,
  onFileSelect,
  onRemove,
  sampleImages = [],
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp định dạng ảnh (JPG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onFileSelect({
        file,
        previewUrl: e.target?.result as string,
        name: file.name,
        size: file.size,
        type: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleClick = (sample: { name: string; url: string }) => {
    if (disabled) return;
    onFileSelect({
      file: null,
      previewUrl: sample.url,
      name: sample.name,
      size: 1024 * 850,
      type: 'image/jpeg'
    });
  };

  const Icon = mediaType === 'book' ? BookOpen : User;
  const badgeColor = mediaType === 'book' ? 'from-blue-600 to-indigo-600' : 'from-indigo-600 to-purple-600';
  const tagLabel = mediaType === 'book' ? 'Bìa sách rõ nét' : 'KOL chân dung';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col justify-between space-y-3.5 h-full hover:border-indigo-200 transition-colors">
      {/* Title & Tag */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${badgeColor} text-white flex items-center justify-center shadow-xs`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-900 font-extrabold text-sm tracking-tight">{title}</span>
        </div>

        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60">
          {tagLabel}
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
          }
        }}
        accept="image/png, image/jpeg, image/webp, image/jpg"
        className="hidden"
        disabled={disabled}
      />

      {/* Image Preview / Drop Zone */}
      {uploadedMedia && uploadedMedia.previewUrl ? (
        <div className="space-y-2.5 flex-1 flex flex-col justify-between">
          <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-square flex items-center justify-center border border-slate-200 shadow-inner group">
            <img
              src={uploadedMedia.previewUrl}
              alt={uploadedMedia.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Top Status Chip */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center space-x-1 border border-white/20">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Đã sẵn sàng</span>
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-rose-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md backdrop-blur-xs disabled:opacity-50"
              title="Xóa ảnh này"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2.5 text-white flex items-center justify-between text-[11px]">
              <span className="font-semibold truncate max-w-[150px]">{uploadedMedia.name}</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="font-bold text-indigo-300 hover:text-white flex items-center space-x-1 underline text-[10px]"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Đổi</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 border border-slate-200/80 disabled:opacity-50"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Thay đổi ảnh</span>
            </button>
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors border border-rose-200/70 disabled:opacity-50"
            >
              Xóa
            </button>
          </div>
        </div>
      ) : (
        /* Empty Drag & Drop Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`flex-1 flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer min-h-[160px] aspect-[4/3] sm:aspect-square ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5 shadow-xs">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800 text-center mb-0.5">
            Kéo thả hoặc nhấn để tải ảnh
          </span>
          <span className="text-[10px] text-slate-500 text-center">
            Hỗ trợ JPG, PNG, WEBP (Tối đa 25MB)
          </span>

          <button
            type="button"
            className="mt-3 px-3.5 py-1.5 bg-white text-indigo-600 border border-indigo-200 rounded-lg text-xs font-bold shadow-xs hover:bg-indigo-50 transition-colors"
          >
            Chọn tệp từ máy
          </button>
        </div>
      )}

      {/* Quick Sample Selector */}
      {sampleImages.length > 0 && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Ảnh mẫu:</span>
          </span>
          <div className="flex items-center space-x-1.5">
            {sampleImages.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleClick(s)}
                disabled={disabled}
                className="px-2 py-0.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-slate-600 font-semibold rounded-md border border-slate-200 text-[10px] transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
