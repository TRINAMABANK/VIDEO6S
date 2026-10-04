import React from 'react';
import { Sparkles, Shield, Cpu, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/70 backdrop-blur py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-800">
                TRÍ AI – BOOK VIDEO FACTORY
              </span>
              <p className="text-xs text-slate-500">
                Hệ sinh thái tự động hóa sản xuất video quảng cáo sách 6s
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap justify-center">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-brand-600" />
              Sẵn sàng kết nối n8n ở Bước 2
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              Bảo mật dữ liệu tuyệt đối
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Render siêu tốc 6s
            </span>
          </div>

          <div className="text-xs text-slate-400">
            © 2026 TRÍ AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
