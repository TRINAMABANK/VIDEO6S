import React, { useState } from 'react';
import { Settings, X, Save, Cloud, Sparkles, Check, Copy } from 'lucide-react';
import type { AppSettings } from '../../types';
import { DEFAULT_SETTINGS } from '../../constants/mockData';
import { copyToClipboard } from '../../utils/helpers';

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
  const [copiedPayload, setCopiedPayload] = useState(false);

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

  const sampleN8nResponse = `{
  "success": true,
  "job_id": "JOB-20261004-8899",
  "status": "RECEIVED",
  "message": "Đã nhận yêu cầu",
  "files_received": {
    "book": "01_BOOK.jpg",
    "kol": "02_KOL.jpg"
  }
}`;

  const handleCopySample = async () => {
    const ok = await copyToClipboard(sampleN8nResponse);
    if (ok) {
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Cài đặt kết nối N8N Webhook</h3>
              <p className="text-xs text-slate-500">Cấu hình URL webhook nhận 2 file sách & KOL và trả JOB_ID</p>
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
          {/* n8n Webhook Toggle */}
          <div className="bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-200 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-brand-600" />
                <span>Kích hoạt kết nối N8N Webhook</span>
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.useN8nWebhook}
                  onChange={(e) => setFormData({ ...formData, useN8nWebhook: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
              </label>
            </div>
            <p className="text-slate-600 text-[11px]">
              Khi kích hoạt, Frontend sẽ gửi trực tiếp HTTP POST (Multipart Form-Data) chứa ảnh Sách & KOL tới n8n Webhook và nhận mã <strong>JOB_ID</strong> kèm thông báo <strong>"Đã nhận yêu cầu"</strong>.
            </p>
          </div>

          {/* n8n Webhook URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-brand-600" />
              <span>n8n Webhook URL:</span>
            </label>
            <input
              type="text"
              value={formData.n8nWebhookUrl}
              onChange={(e) => setFormData({ ...formData, n8nWebhookUrl: e.target.value })}
              placeholder="https://n8n.yourdomain.com/webhook/tri-ai-book-video"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          {/* n8n API Key (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">API Key / Token (Nếu n8n có xác thực):</label>
            <input
              type="password"
              value={formData.n8nApiKey}
              onChange={(e) => setFormData({ ...formData, n8nApiKey: e.target.value })}
              placeholder="Bearer Token hoặc X-API-KEY (Tùy chọn)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          {/* Sample JSON Response from n8n */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Cấu trúc JSON phản hồi từ n8n Webhook:</span>
              </span>
              <button
                type="button"
                onClick={handleCopySample}
                className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
              >
                {copiedPayload ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPayload ? 'Đã sao chép' : 'Sao chép mẫu'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
              {sampleN8nResponse}
            </pre>
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
              <span>{saved ? 'Đã lưu cấu hình!' : 'Lưu cấu hình'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
