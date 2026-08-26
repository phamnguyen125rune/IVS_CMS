'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Globe,
  Bell,
  Shield,
  Palette,
  CheckCircle,
  Save,
  Phone,
  Mail,
  Share2,
  X,
  Edit,
  History,
  Search,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { settingService } from '@/services/setting.service';
import type { GeneralInfo } from '@/types/setting.type';

const tabs = [
  { key: 'general', label: 'Thông tin chung', icon: Globe },
  { key: 'notification', label: 'Thông báo', icon: Bell },
  { key: 'security', label: 'Bảo mật', icon: Shield },
  { key: 'appearance', label: 'Giao diện', icon: Palette },
  { key: 'logs', label: 'Nhật ký hệ thống', icon: History },
];

const mockLogs = [
  {
    id: 1,
    time: '31/07/2026 10:30:00',
    account: 'admin@cms.vn',
    action: 'Cập nhật hệ thống',
    target: 'Giao diện',
    ip: '192.168.1.10',
  },
  {
    id: 2,
    time: '31/07/2026 09:15:22',
    account: 'hoang.tran@cms.vn',
    action: 'Xóa bài viết',
    target: 'Bài viết #1024',
    ip: '113.160.14.22',
  },
  {
    id: 3,
    time: '30/07/2026 15:45:10',
    account: 'lan.le@cms.vn',
    action: 'Duyệt bài viết',
    target: 'Bài viết #1028',
    ip: '14.232.112.5',
  },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFooterModalOpen, setIsFooterModalOpen] = useState(false);

  // State đồng bộ chuẩn với bảng general_info (bao gồm logo, các link mạng xã hội và linker)
  const [info, setInfo] = useState<GeneralInfo>({
    logo: 'default-logo.png',
    companyName: 'CMS Technology',
    websiteName: 'CMS Portal',
    websiteDescription: 'Công ty giải pháp công nghệ hàng đầu Việt Nam.',
    email: 'info@cms.vn',
    facebookLink: '',
    twitterLink: '',
    instagramLink: '',
    linkedinLink: '',
    youtubeLink: '',
    zaloLink: '',
    companyPhoneNumber: '',
    footerLinks: '',
  });

  const [logSearch, setLogSearch] = useState('');

  // Tải dữ liệu từ Backend
  const fetchGeneralInfo = useCallback(async () => {
    try {
      const res = await settingService.getGeneralInfo();
      if (res?.data) {
        setInfo((prev) => ({ ...prev, ...res.data }));
      }
    } catch (error) {
      console.error('Lỗi khi tải thông tin chung:', error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    fetchGeneralInfo();
  }, [fetchGeneralInfo]);

  const handleChange = (key: keyof GeneralInfo, value: string) => {
    setInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await settingService.updateGeneralInfo(info);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Lỗi lưu cài đặt:', error);
      alert('Lưu cài đặt thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = mockLogs.filter(
    (log) =>
      log.account.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Quản lý Cài đặt</h1>
          <p className="text-slate-500 text-sm mt-0.5">Cấu hình hệ thống và tùy chỉnh nền tảng</p>
        </div>
        {activeTab !== 'logs' && (
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: 'var(--primary)' }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Lưu cài đặt
          </button>
        )}
      </div>

      {saved && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 mb-5 text-sm text-emerald-700">
          <CheckCircle size={16} />
          Thông tin cấu hình đã được lưu vào Database thành công!
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-5 pb-20">
        {/* Sidebar tabs */}
        <div className="w-full md:w-52 flex-shrink-0">
          <nav className="space-y-0.5">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                  activeTab === key
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-5xl">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div
                className="bg-white rounded-xl border p-6"
                style={{ borderColor: 'var(--border)' }}
              >
                <h2 className="font-semibold text-slate-900 font-display mb-5">Hệ thống cơ bản</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Tên công ty (company_name)
                    </label>
                    <input
                      value={info.companyName || ''}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                      className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500"
                      style={{ borderColor: 'var(--border)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Tên website (website_name)
                    </label>
                    <input
                      value={info.websiteName || ''}
                      onChange={(e) => handleChange('websiteName', e.target.value)}
                      className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500"
                      style={{ borderColor: 'var(--border)' }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Mô tả website (website_description)
                    </label>
                    <textarea
                      rows={3}
                      value={info.websiteDescription || ''}
                      onChange={(e) => handleChange('websiteDescription', e.target.value)}
                      className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 resize-none"
                      style={{ borderColor: 'var(--border)' }}
                    />
                  </div>
                </div>
              </div>

              <div
                className="bg-white rounded-xl border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                style={{ borderColor: 'var(--border)' }}
              >
                <div>
                  <h2 className="font-semibold text-slate-900 font-display mb-1">
                    Cấu hình Giao diện Footer
                  </h2>
                  <p className="text-sm text-slate-500">
                    Chỉnh sửa logo, liên kết mạng xã hội, thông tin liên hệ, linker và bản quyền
                    hiển thị dưới chân trang.
                  </p>
                </div>
                <button
                  onClick={() => setIsFooterModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <Edit size={16} />
                  Chỉnh sửa Footer
                </button>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div
              className="bg-white rounded-xl border overflow-hidden flex flex-col"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="p-5 border-b space-y-4" style={{ borderColor: 'var(--border)' }}>
                <h2 className="font-semibold text-slate-900 font-display">Nhật ký hệ thống</h2>
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    placeholder="Tìm theo tài khoản hoặc thao tác..."
                    className="w-full pl-9 pr-3 py-2 border rounded-xl text-sm outline-none focus:border-blue-500"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b" style={{ borderColor: 'var(--border)' }}>
                      <th className="px-5 py-3 font-semibold text-slate-500">Thời gian</th>
                      <th className="px-5 py-3 font-semibold text-slate-500">Tài khoản</th>
                      <th className="px-5 py-3 font-semibold text-slate-500">Thao tác</th>
                      <th className="px-5 py-3 font-semibold text-slate-500">Đối tượng</th>
                      <th className="px-5 py-3 font-semibold text-slate-500">IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3.5 text-slate-500">{log.time}</td>
                        <td className="px-5 py-3.5 font-medium text-slate-800">{log.account}</td>
                        <td className="px-5 py-3.5 text-slate-700">{log.action}</td>
                        <td className="px-5 py-3.5 text-slate-600">{log.target}</td>
                        <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL CHỈNH SỬA FOOTER, LOGO & LINKER ================= */}
      {isFooterModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 lg:p-8"
          onClick={() => setIsFooterModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl flex flex-col overflow-hidden max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between p-5 border-b shrink-0 bg-white"
              style={{ borderColor: 'var(--border)' }}
            >
              <div>
                <h2 className="font-semibold text-slate-900 font-display text-lg">
                  Chỉnh sửa Giao diện Footer, Logo & Linker
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Tùy chỉnh logo, thông tin thương hiệu, liên kết mạng xã hội và chân trang.
                </p>
              </div>
              <button
                onClick={() => setIsFooterModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#0f172a] p-6 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Cột trái: Logo, Tên website, Mô tả & Mạng xã hội đầy đủ */}
                <div className="lg:col-span-6 space-y-5">
                  {/* Ô nhập Logo */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <ImageIcon size={14} /> Logo Website (URL / Tên file)
                    </label>
                    <input
                      value={info.logo || ''}
                      onChange={(e) => handleChange('logo', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-300 outline-none focus:border-blue-500"
                      placeholder="VD: logo.png hoặc https://..."
                    />
                  </div>

                  <input
                    value={info.websiteName || ''}
                    onChange={(e) => handleChange('websiteName', e.target.value)}
                    className="bg-transparent border-b border-slate-700 text-white font-bold text-xl outline-none focus:border-blue-500 pb-1 w-full"
                    placeholder="Tên website"
                  />
                  <textarea
                    rows={3}
                    value={info.websiteDescription || ''}
                    onChange={(e) => handleChange('websiteDescription', e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 outline-none resize-none"
                    placeholder="Mô tả công ty..."
                  />

                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Share2 size={14} /> Mạng xã hội đầy đủ
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        value={info.facebookLink || ''}
                        onChange={(e) => handleChange('facebookLink', e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
                        placeholder="Link Facebook"
                      />
                      <input
                        value={info.twitterLink || ''}
                        onChange={(e) => handleChange('twitterLink', e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
                        placeholder="Link Twitter"
                      />
                      <input
                        value={info.instagramLink || ''}
                        onChange={(e) => handleChange('instagramLink', e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
                        placeholder="Link Instagram"
                      />
                      <input
                        value={info.linkedinLink || ''}
                        onChange={(e) => handleChange('linkedinLink', e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
                        placeholder="Link LinkedIn"
                      />
                      <input
                        value={info.youtubeLink || ''}
                        onChange={(e) => handleChange('youtubeLink', e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
                        placeholder="Link YouTube"
                      />
                      <input
                        value={info.zaloLink || ''}
                        onChange={(e) => handleChange('zaloLink', e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
                        placeholder="Link Zalo"
                      />
                    </div>
                  </div>
                </div>

                {/* Cột phải: Thông tin liên hệ & Linker phụ */}
                <div className="lg:col-span-6 space-y-5">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Thông tin liên hệ & Linker
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Số điện thoại công ty
                      </label>
                      <input
                        value={info.companyPhoneNumber || ''}
                        onChange={(e) => handleChange('companyPhoneNumber', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500"
                        placeholder="+84 28..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Email liên hệ</label>
                      <input
                        value={info.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500"
                        placeholder="info@cms.vn"
                      />
                    </div>

                    {/* Ô cấu hình Linker phụ dưới chân trang */}
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Liên kết phụ Footer (Linker)
                      </label>
                      <input
                        value={info.footerLinks || ''}
                        onChange={(e) => handleChange('footerLinks', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500"
                        placeholder="Chính sách bảo mật, Điều khoản sử dụng, Cookie"
                      />
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        Nhập danh sách liên kết, ngăn cách nhau bằng dấu phẩy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="p-4 border-t bg-slate-50 flex justify-end gap-3 shrink-0"
              style={{ borderColor: 'var(--border)' }}
            >
              <button
                onClick={() => setIsFooterModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border text-sm font-medium text-slate-600 hover:bg-white"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setIsFooterModalOpen(false);
                  handleSave();
                }}
                className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{ background: 'var(--primary)' }}
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
