import React, { useRef, useState } from 'react';
import { Upload, X, ArrowUpCircle, BookOpen, User } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col justify-between space-y-3">
      {/* Title */}
      <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
        <Icon className="w-4 h-4 text-purple-600" />
        <span>{title}</span>
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
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-square flex items-center justify-center border border-slate-200">
            <img
              src={uploadedMedia.previewUrl}
              alt={uploadedMedia.name}
              className="w-full h-full object-cover"
            />
            {/* Remove X Button */}
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100/80 border border-brand-200/80 transition-colors"
          >
            <ArrowUpCircle className="w-3.5 h-3.5" />
            <span>Thay đổi ảnh</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl aspect-square flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all ${
              isDragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-400 bg-slate-50/70'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-700">Kéo thả ảnh hoặc tải lên</p>
            <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG (Tối đa 15MB)</p>
          </div>

          {/* Preset Buttons */}
          {sampleImages.length > 0 && (
            <div className="flex gap-1.5 flex-wrap pt-1">
              {sampleImages.map((sample, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => handleSampleClick(sample)}
                  disabled={disabled}
                  className="text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 px-2 py-1 rounded-lg border border-slate-200 transition-colors"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
