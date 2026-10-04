import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Trash2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import type { UploadedMedia } from '../../types';
import { formatBytes } from '../../utils/helpers';

interface UploadCardProps {
  cardIndex: number;
  title: string;
  subtitle: string;
  mediaType: 'book' | 'kol';
  uploadedMedia: UploadedMedia | null;
  onFileSelect: (media: UploadedMedia) => void;
  onRemove: () => void;
  sampleImages?: { name: string; url: string; label: string }[];
  disabled?: boolean;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  cardIndex,
  title,
  subtitle,
  uploadedMedia,
  onFileSelect,
  onRemove,
  sampleImages = [],
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Vui lòng chọn tệp định dạng ảnh (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Dung lượng ảnh tối đa là 15MB.');
      return;
    }

    setErrorMsg(null);
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleSampleClick = (sample: { name: string; url: string }) => {
    if (disabled) return;
    setErrorMsg(null);
    onFileSelect({
      file: null,
      previewUrl: sample.url,
      name: sample.name,
      size: 1024 * 850, // mock ~850KB
      type: 'image/jpeg'
    });
  };

  return (
    <div
      className={`relative bg-white rounded-2xl border transition-all duration-300 shadow-card flex flex-col h-full ${
        uploadedMedia
          ? 'border-brand-300 ring-1 ring-brand-200'
          : isDragging
          ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-400'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Card Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
              uploadedMedia
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {cardIndex}
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              {title}
              {uploadedMedia && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 inline-block" />
              )}
            </h3>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>

        {uploadedMedia && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Sẵn sàng
          </span>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/png, image/jpeg, image/webp, image/jpg"
        className="hidden"
        disabled={disabled}
      />

      {/* Card Body / Drag & Drop or Preview Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        {uploadedMedia && uploadedMedia.previewUrl ? (
          /* PREVIEW STATE */
          <div className="space-y-4">
            <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900/5 aspect-[4/3] flex items-center justify-center">
              <img
                src={uploadedMedia.previewUrl}
                alt={uploadedMedia.name}
                className="w-full h-full object-contain max-h-60 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-white text-xs">
                <span className="truncate">{uploadedMedia.name}</span>
              </div>
            </div>

            {/* File info pill */}
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
              <div className="flex items-center space-x-2 truncate">
                <ImageIcon className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span className="font-medium text-slate-700 truncate max-w-[150px] sm:max-w-[200px]">
                  {uploadedMedia.name}
                </span>
              </div>
              <span className="text-slate-400 font-mono text-[11px] flex-shrink-0">
                {formatBytes(uploadedMedia.size)}
              </span>
            </div>

            {/* Action Buttons: Thay đổi ảnh / Xóa ảnh */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Thay đổi ảnh</span>
              </button>

              <button
                type="button"
                onClick={onRemove}
                disabled={disabled}
                className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Xóa ảnh</span>
              </button>
            </div>
          </div>
        ) : (
          /* EMPTY UPLOAD / DRAG & DROP STATE */
          <div className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[200px] ${
                isDragging
                  ? 'border-brand-500 bg-brand-50/60 scale-[0.99]'
                  : 'border-slate-300 hover:border-brand-400 hover:bg-brand-50/20 bg-slate-50/50'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7 text-brand-600" />
              </div>

              <p className="text-sm font-bold text-slate-800 mb-1">
                Kéo thả ảnh vào đây, hoặc{' '}
                <span className="text-brand-600 underline font-extrabold hover:text-brand-700">
                  Chọn ảnh
                </span>
              </p>
              <p className="text-xs text-slate-400">
                Hỗ trợ JPG, PNG, WEBP (Tối đa 15MB)
              </p>

              <button
                type="button"
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow transition-all"
              >
                Chọn ảnh từ máy
              </button>
            </div>

            {/* Sample Presets */}
            {sampleImages.length > 0 && (
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Hoặc chọn ảnh mẫu nhanh:
                </div>
                <div className="flex flex-wrap gap-2">
                  {sampleImages.map((sample, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleSampleClick(sample)}
                      disabled={disabled}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-slate-100 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 hover:border-brand-200 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                      <span>{sample.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-center space-x-2 text-rose-600 bg-rose-50 p-2.5 rounded-xl text-xs border border-rose-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
