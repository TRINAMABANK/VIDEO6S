import React from 'react';
import { Home, History, Folder, Settings, ChevronDown } from 'lucide-react';

interface HeaderProps {
  activeTab: 'create' | 'history' | 'drive' | 'settings';
  onTabChange: (tab: 'create' | 'history' | 'drive' | 'settings') => void;
  historyCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, historyCount = 0 }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c1427] text-white border-b border-slate-800 shadow-md">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Left: Brand Logo & Subtitle */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('create')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-500 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-[#0c1427] rounded-[7px] flex items-center justify-center">
                <span className="font-extrabold text-sm bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  C
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <h1 className="text-lg font-black tracking-wide text-white">
                TRÍ AI
              </h1>
              <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase border-l border-slate-700 pl-2.5">
                BOOK VIDEO FACTORY
              </span>
            </div>
          </div>

          {/* Center: Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1.5 text-xs font-semibold">
            <button
              onClick={() => onTabChange('create')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'create'
                  ? 'bg-indigo-600/40 text-white border border-indigo-500/50 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tạo Video</span>
            </button>

            <button
              onClick={() => onTabChange('history')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'history'
                  ? 'bg-indigo-600/40 text-white border border-indigo-500/50 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>Lịch sử</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 bg-indigo-500 text-white text-[10px] rounded-full font-bold">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('drive')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'drive'
                  ? 'bg-indigo-600/40 text-white border border-indigo-500/50 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Folder className="w-3.5 h-3.5 text-slate-400" />
              <span>Thư viện Drive</span>
            </button>

            <button
              onClick={() => onTabChange('settings')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'settings'
                  ? 'bg-indigo-600/40 text-white border border-indigo-500/50 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Cài đặt</span>
            </button>
          </nav>

          {/* Right: User Profile & Dropdown */}
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center space-x-2.5 bg-slate-800/60 hover:bg-slate-800 p-1 pr-2.5 rounded-full border border-slate-700/60 cursor-pointer transition-colors">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Tri AI"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-400"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight">Trí AI</span>
                <span className="text-[10px] text-slate-400 leading-tight">Owner</span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
