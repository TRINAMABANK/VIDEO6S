import React from 'react';
import { Sparkles, Shield, Cpu, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-6 select-none">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 p-0.5 shadow-sm">
              <div className="w-full h-full bg-[#070A13] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                TRÍ AI – BOOK VIDEO FACTORY
              </span>
              <p className="text-[11px] font-medium text-slate-500">
                Nền tảng tự động hóa sản xuất video quảng cáo sách 6s đỉnh cao
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 flex-wrap justify-center">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/70">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>n8n Webhook Architecture</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/70">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bảo mật dữ liệu 100%</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/70">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Render 6s TikTok / Reels</span>
            </span>
          </div>

          <div className="text-xs font-medium text-slate-400">
            © 2026 TRÍ AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
