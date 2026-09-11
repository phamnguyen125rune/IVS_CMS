'use client';

import { useCallback, useEffect, useState } from 'react';

import { settingService } from '@/services/setting.service';

import type { GeneralInfo, UpdateGeneralInfoRequest } from '@/types/setting.type';

import { DEFAULT_GENERAL_INFO } from '../constants/settings.constants';

import { validateGeneralInfo } from '../utils/settings.validation';

export function useGeneralInfo() {
  const [info, setInfo] = useState<GeneralInfo>(DEFAULT_GENERAL_INFO);

  const [editInfo, setEditInfo] = useState<GeneralInfo>(DEFAULT_GENERAL_INFO);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [footerModalLoading, setFooterModalLoading] = useState(false);

  const [isFooterModalOpen, setIsFooterModalOpen] = useState(false);

  const [saved, setSaved] = useState(false);

  /**
   * GET general info.
   */
  const fetchGeneralInfo = useCallback(async (): Promise<GeneralInfo | null> => {
    try {
      setLoading(true);

      const response = await settingService.getGeneralInfo();

      if (!response?.data) {
        return null;
      }

      setInfo(response.data);

      return response.data;
    } catch (error) {
      console.error('Lỗi khi tải thông tin chung:', error);

      alert('Không thể tải thông tin website.');

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load dữ liệu lần đầu.
   */
  useEffect(() => {
    fetchGeneralInfo();
  }, [fetchGeneralInfo]);

  /**
   * Update field trong info.
   */
  const handleChange = (key: keyof GeneralInfo, value: string) => {
    setInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * Update field trong editInfo.
   *
   * editInfo hoàn toàn độc lập với info.
   */
  const handleEditChange = (key: keyof GeneralInfo, value: string) => {
    setEditInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * Mở Footer modal.
   *
   * QUAN TRỌNG:
   * Luôn GET dữ liệu mới nhất trước khi mở modal.
   */
  const openFooterModal = async () => {
    try {
      setFooterModalLoading(true);

      const response = await settingService.getGeneralInfo();

      if (!response?.data) {
        alert('Không tìm thấy thông tin website.');
        return;
      }

      setInfo(response.data);

      setEditInfo({
        ...response.data,
      });

      setIsFooterModalOpen(true);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu Footer:', error);

      alert('Không thể tải dữ liệu hiện tại.');
    } finally {
      setFooterModalLoading(false);
    }
  };

  /**
   * Đóng modal.
   */
  const closeFooterModal = () => {
    if (saving) {
      return;
    }

    setIsFooterModalOpen(false);
  };

  /**
   * POST general info.
   */
  const handleSave = async (data: GeneralInfo, closeModal = false) => {
    if (!validateGeneralInfo(data)) {
      return;
    }

    try {
      setSaving(true);

      const payload: UpdateGeneralInfoRequest = {
        logo: data.logo.trim(),

        companyName: data.companyName.trim(),

        websiteName: data.websiteName?.trim() || '',

        websiteDescription: data.websiteDescription?.trim() || '',

        email: data.email?.trim() || '',

        facebookLink: data.facebookLink?.trim() || '',

        twitterLink: data.twitterLink?.trim() || '',

        instagramLink: data.instagramLink?.trim() || '',

        linkedinLink: data.linkedinLink?.trim() || '',

        youtubeLink: data.youtubeLink?.trim() || '',

        zaloLink: data.zaloLink?.trim() || '',

        companyPhoneNumber: data.companyPhoneNumber?.trim() || '',

        address: data.address?.trim() || '',

        workingHours: data.workingHours?.trim() || '',

        mapEmbedUrl: data.mapEmbedUrl?.trim() || '',

        footerLinks: data.footerLinks?.trim() || '',
      };

      const response = await settingService.updateGeneralInfo(payload);

      if (!response?.data) {
        alert('Cập nhật thông tin website thất bại.');
        return;
      }

      /*
       * Luôn lấy dữ liệu BE trả về
       * làm source of truth.
       */
      setInfo(response.data);

      setEditInfo({
        ...response.data,
      });

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);

      if (closeModal) {
        setIsFooterModalOpen(false);
      }
    } catch (error) {
      console.error('Lỗi lưu thông tin chung:', error);

      alert('Không thể cập nhật thông tin website.');
    } finally {
      setSaving(false);
    }
  };

  return {
    info,
    editInfo,

    loading,
    saving,
    saved,

    footerModalLoading,
    isFooterModalOpen,

    fetchGeneralInfo,

    handleChange,
    handleEditChange,

    openFooterModal,
    closeFooterModal,

    handleSave,
  };
}
