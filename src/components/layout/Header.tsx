import React from 'react';
import { Home, History, Folder, Settings, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'create' | 'history' | 'drive' | 'settings';
  onTabChange: (tab: 'create' | 'history' | 'drive' | 'settings') => void;
  historyCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, historyCount = 0 }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070A13]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-xl text-white select-none">
      {/* Subtle top neon accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 opacity-80" />

      <div className="max-w-[1540px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-[68px]">
          
          {/* Left: Brand Logo & Subtitle */}
          <div 
            className="flex items-center space-x-3.5 cursor-pointer group" 
            onClick={() => onTabChange('create')}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 p-[2px] shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full bg-[#090D1A] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              {/* Green online pulse dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#070A13] flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping" />
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  TRÍ AI
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PRO
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                BOOK VIDEO FACTORY
              </span>
            </div>
          </div>

          {/* Center: Navigation Menu Pills */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-slate-900/80 p-1.5 rounded-full border border-white/[0.08] shadow-inner">
            <button
              onClick={() => onTabChange('create')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/30 border border-indigo-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Tạo Video</span>
            </button>

            <button
              onClick={() => onTabChange('history')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/30 border border-indigo-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Lịch sử</span>
              {historyCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-indigo-500/90 text-white text-[10px] rounded-full font-black shadow-xs">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('drive')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                activeTab === 'drive'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/30 border border-indigo-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>Thư viện Drive</span>
            </button>

            <button
              onClick={() => onTabChange('settings')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/30 border border-indigo-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Cài đặt</span>
            </button>
          </nav>

          {/* Right: User Profile & Engine Status */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400 animate-pulse" />
              <span>AI Engine Sẵn sàng</span>
            </div>

            <div 
              onClick={() => onTabChange('settings')}
              className="flex items-center space-x-2.5 bg-white/[0.05] hover:bg-white/[0.1] p-1.5 pr-3.5 rounded-full border border-white/[0.1] cursor-pointer transition-all duration-200"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Trí AI"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/60"
                />
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 absolute -bottom-1 -right-1 bg-[#070A13] rounded-full" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight">Trí AI</span>
                <span className="text-[10px] font-semibold text-indigo-300 leading-tight">Owner</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
