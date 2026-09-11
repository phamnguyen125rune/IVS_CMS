import { Bell, Globe, History, Palette, Shield } from 'lucide-react';

import type { GeneralInfo } from '@/types/setting.type';

export const SETTINGS_TABS = [
  {
    key: 'general',
    label: 'Thông tin chung',
    icon: Globe,
  },
  {
    key: 'notification',
    label: 'Thông báo',
    icon: Bell,
  },
  {
    key: 'security',
    label: 'Bảo mật',
    icon: Shield,
  },
  {
    key: 'appearance',
    label: 'Giao diện',
    icon: Palette,
  },
  {
    key: 'logs',
    label: 'Nhật ký hệ thống',
    icon: History,
  },
] as const;

export type SettingsTabKey = (typeof SETTINGS_TABS)[number]['key'];

export const DEFAULT_GENERAL_INFO: GeneralInfo = {
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
  address: '',
  workingHours: '',
  mapEmbedUrl: '',

  footerLinks: '',
};

export const MOCK_LOGS = [
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
