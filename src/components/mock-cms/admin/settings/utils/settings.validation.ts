import type { GeneralInfo } from '@/types/setting.type';

const isValidEmail = (value: string): boolean => {
  if (!value.trim()) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

const isValidUrl = (value: string): boolean => {
  if (!value.trim()) {
    return true;
  }

  try {
    const url = new URL(value.trim());

    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidPhone = (value: string): boolean => {
  if (!value.trim()) {
    return true;
  }

  return /^\+?[0-9\s().-]{8,20}$/.test(value.trim());
};

export const validateGeneralInfo = (data: GeneralInfo): boolean => {
  if (!data.logo?.trim()) {
    alert('Logo không được để trống.');
    return false;
  }

  if (!data.companyName?.trim()) {
    alert('Tên công ty không được để trống.');
    return false;
  }

  if (data.websiteName && data.websiteName.length > 60) {
    alert('Tên website không được vượt quá 60 ký tự.');
    return false;
  }

  if (data.email && !isValidEmail(data.email)) {
    alert('Email không đúng định dạng.');
    return false;
  }

  if (data.companyPhoneNumber && !isValidPhone(data.companyPhoneNumber)) {
    alert('Số điện thoại không đúng định dạng.');
    return false;
  }

  const socialLinks = [
    ['Facebook', data.facebookLink],
    ['Twitter', data.twitterLink],
    ['Instagram', data.instagramLink],
    ['LinkedIn', data.linkedinLink],
    ['YouTube', data.youtubeLink],
    ['Zalo', data.zaloLink],
  ] as const;

  for (const [name, value] of socialLinks) {
    if (value && !isValidUrl(value)) {
      alert(`${name} link không đúng định dạng URL.`);
      return false;
    }
  }

  if (data.mapEmbedUrl && !isValidUrl(data.mapEmbedUrl)) {
    alert('Google Maps Embed URL không đúng định dạng.');
    return false;
  }

  return true;
};
