import React from 'react';
import { Sparkles, Video, History, HardDrive, Settings, Bell, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'create' | 'history' | 'drive' | 'settings';
  onTabChange: (tab: 'create' | 'history' | 'drive' | 'settings') => void;
  historyCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, historyCount = 0 }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Left: Brand Logo & Subtitle */}
          <div className="flex items-center space-x-3 sm:space-x-4 cursor-pointer" onClick={() => onTabChange('create')}>
            <div className="relative group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-brand-700 via-brand-600 to-purple-600 bg-clip-text text-transparent">
                  TRÍ AI
                </h1>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 border border-brand-200/60 uppercase tracking-wider">
                  v2.6 SaaS
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold tracking-widest text-slate-500 uppercase">
                BOOK VIDEO FACTORY
              </p>
            </div>
          </div>

          {/* Center: Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => onTabChange('create')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'create'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Video className="w-4 h-4 text-brand-600" />
              <span>Tạo Video</span>
            </button>

            <button
              onClick={() => onTabChange('history')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <History className="w-4 h-4 text-slate-500" />
              <span>Lịch sử</span>
              {historyCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-brand-100 text-brand-700 text-[10px] rounded-full font-bold">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('drive')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'drive'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <HardDrive className="w-4 h-4 text-slate-500" />
              <span>Thư viện Drive</span>
            </button>

            <button
              onClick={() => onTabChange('settings')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Cài đặt</span>
            </button>
          </nav>

          {/* Right: User Profile & Status */}
          <div className="flex items-center space-x-3">
            <button
              aria-label="Thông báo"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors hidden sm:flex"
            >
              <Bell className="w-5 h-5" />
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <div className="flex items-center space-x-3 pl-1">
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-purple-600 to-brand-500 p-0.5 shadow-sm">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-sm text-brand-700 overflow-hidden">
                    <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent font-extrabold">
                      TA
                    </span>
                  </div>
                </div>
                <div className="absolute 0 bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></div>
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-slate-800">Trí AI</span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-700 border border-purple-200">
                    <ShieldCheck className="w-3 h-3" />
                    Owner
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 hidden sm:inline-block">
                  admin@triai.factory
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Mobile Nav Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 text-xs">
          <button
            onClick={() => onTabChange('create')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg ${
              activeTab === 'create' ? 'text-brand-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Video className="w-4 h-4 mb-0.5" />
            <span>Tạo Video</span>
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg ${
              activeTab === 'history' ? 'text-brand-600 font-bold' : 'text-slate-500'
            }`}
          >
            <History className="w-4 h-4 mb-0.5" />
            <span>Lịch sử</span>
          </button>
          <button
            onClick={() => onTabChange('drive')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg ${
              activeTab === 'drive' ? 'text-brand-600 font-bold' : 'text-slate-500'
            }`}
          >
            <HardDrive className="w-4 h-4 mb-0.5" />
            <span>Drive</span>
          </button>
          <button
            onClick={() => onTabChange('settings')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg ${
              activeTab === 'settings' ? 'text-brand-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Settings className="w-4 h-4 mb-0.5" />
            <span>Cài đặt</span>
          </button>
        </div>
      </div>
    </header>
  );
};
