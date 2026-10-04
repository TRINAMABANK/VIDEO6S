import React, { useState } from 'react';
import { Settings, X, Save, Cloud, Sparkles, Check } from 'lucide-react';
import type { AppSettings } from '../../types';
import { DEFAULT_SETTINGS } from '../../constants/mockData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings || DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Cài đặt hệ thống</h3>
              <p className="text-xs text-slate-500">Cấu hình sẵn sàng kết nối n8n API & AI Model ở Bước 2</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 2 notice badge */}
          <div className="bg-brand-50 border border-brand-200 rounded-2xl p-3.5 text-xs text-brand-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Cấu hình sẵn sàng cho Bước 2:</span> Bạn có thể cấu hình endpoint n8n webhook tại đây. Hiện tại hệ thống đang chạy ở chế độ UI Simulation.
            </div>
          </div>

          {/* n8n Webhook URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-brand-600" />
              <span>n8n Webhook URL (Bước 2):</span>
            </label>
            <input
              type="text"
              value={formData.n8nWebhookUrl}
              onChange={(e) => setFormData({ ...formData, n8nWebhookUrl: e.target.value })}
              placeholder="https://n8n.yourdomain.com/webhook/tri-ai-book-video"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          {/* AI Models */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">AI Copywriting & Storyboard:</label>
              <select
                value={formData.aiModelText}
                onChange={(e) => setFormData({ ...formData, aiModelText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
              >
                <option value="OpenAI GPT-4o / Grok 3">OpenAI GPT-4o / Grok 3</option>
                <option value="Claude 3.7 Sonnet">Claude 3.7 Sonnet</option>
                <option value="Gemini 2.5 Flash">Gemini 2.5 Flash</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Video Generation Engine:</label>
              <select
                value={formData.aiModelVideo}
                onChange={(e) => setFormData({ ...formData, aiModelVideo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
              >
                <option value="Kling AI / Runway Gen-3">Kling AI / Runway Gen-3</option>
                <option value="Luma Dream Machine">Luma Dream Machine</option>
                <option value="Minimax Video-01">Minimax Video-01</option>
              </select>
            </div>
          </div>

          {/* Quality & Google Drive Folder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Chất lượng xuất:</label>
              <select
                value={formData.videoQuality}
                onChange={(e) => setFormData({ ...formData, videoQuality: e.target.value as '1080p' | '4k' | '720p' })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
              >
                <option value="1080p">1080p Full HD (Chuẩn TikTok 9:16)</option>
                <option value="4k">4K Ultra HD</option>
                <option value="720p">720p HD (Tối ưu băng thông)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Thư mục Google Drive gốc:</label>
              <input
                type="text"
                value={formData.googleDriveRootFolder}
                onChange={(e) => setFormData({ ...formData, googleDriveRootFolder: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-1.5 shadow-sm"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{saved ? 'Đã lưu cài đặt!' : 'Lưu cài đặt'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
