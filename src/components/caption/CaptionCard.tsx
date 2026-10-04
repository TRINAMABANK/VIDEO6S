import React, { useState } from 'react';
import { FileText, Copy, Check, Sparkles, Hash, Edit3 } from 'lucide-react';
import { copyToClipboard } from '../../utils/helpers';

interface CaptionCardProps {
  captionText: string;
  hashtags: string[];
}

export const CaptionCard: React.FC<CaptionCardProps> = ({
  captionText,
  hashtags
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCaption, setCurrentCaption] = useState(captionText);

  const fullTextToCopy = `${currentCaption}\n\n${hashtags.join(' ')}`;

  const handleCopy = async () => {
    const ok = await copyToClipboard(fullTextToCopy);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyTag = async (tag: string) => {
    await copyToClipboard(tag);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                Caption sẽ được tạo tự động
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                AI Copywriting
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Nội dung chuẩn chuyển đổi cao, tích hợp Call-to-Action kích thích mua hàng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Xong' : 'Chỉnh sửa'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-brand-600 to-purple-600 text-white hover:shadow-md'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã sao chép!' : 'Sao chép toàn bộ'}</span>
          </button>
        </div>
      </div>

      {/* Caption Content Box */}
      <div className="space-y-4">
        <div className="relative">
          {isEditing ? (
            <textarea
              value={currentCaption}
              onChange={(e) => setCurrentCaption(e.target.value)}
              rows={6}
              className="w-full p-4 rounded-2xl border border-brand-300 focus:ring-2 focus:ring-brand-400 focus:outline-none font-sans text-xs sm:text-sm text-slate-800 leading-relaxed bg-white"
            />
          ) : (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium shadow-inner">
              {currentCaption}
            </div>
          )}

          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
            <span>Độ dài: {currentCaption.length} ký tự (Tối ưu cho TikTok / Reels &lt; 500 ký tự)</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Chuẩn SEO Viral
            </span>
          </div>
        </div>

        {/* Hashtags Section */}
        <div className="pt-2">
          <div className="flex items-center space-x-2 mb-2.5">
            <Hash className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Hashtags Đề Xuất (Trending BookTok):
            </h4>
          </div>

          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleCopyTag(tag)}
                title="Click để sao chép tag"
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/80 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{tag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
