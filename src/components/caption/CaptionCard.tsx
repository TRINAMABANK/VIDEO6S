import React, { useState } from 'react';
import { MessageSquare, Copy, Check, Hash } from 'lucide-react';
import { copyToClipboard } from '../../utils/helpers';

interface CaptionCardProps {
  captionText?: string;
  hashtags?: string[];
}

export const CaptionCard: React.FC<CaptionCardProps> = () => {
  const [copied, setCopied] = useState(false);

  const defaultCaption = `📖 Một cuốn sách hay đôi khi thay đổi cả cách chúng ta nhìn cuộc sống. "Đắc Nhân Tâm" không chỉ là một cuốn sách, mà là chiếc chìa khóa vạn năng giúp bạn thấu hiểu lòng người và bứt phá thành công trong sự nghiệp & cuộc sống.

Bạn đã sở hữu cuốn sách này trong tủ sách của mình chưa? 💙 Comment bên dưới nhé!

#sachhay #docsach #dacnhantam #booktok #phattrienbanthan #kynangsong #reviewsach #TriAI #xuhuong2026`;

  const hashtagList = [
    '#sachhay', '#docsach', '#dacnhantam', '#booktok',
    '#phattrienbanthan', '#kynangsong', '#reviewsach', '#TriAI'
  ];

  const handleCopy = async () => {
    const ok = await copyToClipboard(defaultCaption);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col justify-between space-y-3.5 h-full hover:border-indigo-200 transition-colors select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
              Caption tự động cho Video
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-xs ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Đã sao chép!' : 'Sao chép Caption'}</span>
        </button>
      </div>

      {/* Target Platforms */}
      <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-600">
        <span className="text-slate-400">Tối ưu cho:</span>
        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">TikTok Shop</span>
        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">IG Reels</span>
        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">YT Shorts</span>
      </div>

      {/* Caption Content Box */}
      <div className="bg-slate-50/90 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed space-y-2 font-medium flex-1">
        <div className="flex items-center justify-between text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest font-mono">
          <span>NỘI DUNG BÀI ĐĂNG</span>
          <span className="text-slate-400 lowercase font-normal">148 từ • 890 ký tự</span>
        </div>
        <p className="text-slate-700">
          📖 Một cuốn sách hay đôi khi thay đổi cả cách chúng ta nhìn cuộc sống. <strong>"Đắc Nhân Tâm"</strong> không chỉ là một cuốn sách, mà là chiếc chìa khóa vạn năng giúp bạn thấu hiểu lòng người và bứt phá thành công trong sự nghiệp & cuộc sống.
        </p>
        <p className="text-slate-700 font-semibold">
          Bạn đã sở hữu cuốn sách này trong tủ sách của mình chưa? 💙 Comment bên dưới nhé!
        </p>
      </div>

      {/* Hashtags Cloud */}
      <div className="pt-1 flex flex-wrap gap-1.5 items-center">
        <Hash className="w-3.5 h-3.5 text-indigo-500" />
        {hashtagList.map((tag, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md text-[10px] font-bold cursor-pointer transition-colors border border-indigo-100"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
