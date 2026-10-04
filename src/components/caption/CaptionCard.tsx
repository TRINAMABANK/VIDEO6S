import React, { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../../utils/helpers';

interface CaptionCardProps {
  captionText?: string;
  hashtags?: string[];
}

export const CaptionCard: React.FC<CaptionCardProps> = () => {
  const [copied, setCopied] = useState(false);

  const defaultCaption = `CAPTION
📖 Một cuốn sách hay đôi khi thay đổi cả cách chúng ta nhìn cuộc sống. "Đắc Nhân Tâm" không chỉ là một cuốn sách, mà là chìa khóa giúp bạn hiểu người khác và thành công hơn trong cuộc sống.

Bạn đã đọc chưa? 💙
#sachhay #docsach #dacnhantam #booktok #phattrienbanthan #kynangsong #reviewSach #TriAI`;

  const handleCopy = async () => {
    const ok = await copyToClipboard(defaultCaption);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col justify-between space-y-3 h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-sm sm:text-base text-slate-900">
            Mẫu caption sẽ được tạo
          </h3>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center space-x-1 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100/80 px-2.5 py-1 rounded-lg transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
        </button>
      </div>

      {/* Caption Content Box */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2 font-medium flex-1">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          CAPTION
        </div>
        <p>
          📖 Một cuốn sách hay đôi khi thay đổi cả cách chúng ta nhìn cuộc sống. "Đắc Nhân Tâm" không chỉ là một cuốn sách, mà là chìa khóa giúp bạn hiểu người khác và thành công hơn trong cuộc sống.
        </p>
        <p>
          Bạn đã đọc chưa? 💙
        </p>
        <p className="text-brand-600 font-normal">
          #sachhay #docsach #dacnhantam #booktok #phattrienbanthan #kynangsong #reviewSach #TriAI
        </p>
      </div>
    </div>
  );
};
