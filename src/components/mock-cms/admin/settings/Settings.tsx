'use client';

import { CheckCircle, Loader2, Save } from 'lucide-react';
import { useState } from 'react';

import { type SettingsTabKey } from './constants/settings.constants';

import GeneralSettings from './GeneralSettings';
import SettingsTabs from './SettingsTabs';
import SystemLogs from './SystemLogs';

import { useGeneralInfo } from './hooks/useGeneralInfo';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTabKey>('general');

  const { info, loading, saving, saved, handleChange, handleSave } = useGeneralInfo();

  /**
   * Save dữ liệu General tab.
   */
  const handleGeneralSave = () => {
    handleSave(info);
  };

  return (
    <div
      className="
        relative min-h-full
        p-6
      "
      style={{
        background: 'var(--background)',
        color: 'var(--text)',
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="
          mb-6 flex
          flex-col gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h1
            className="
              font-display
              text-xl font-bold
            "
            style={{
              color: 'var(--text)',
            }}
          >
            Quản lý Cài đặt
          </h1>

          <p
            className="mt-0.5 text-sm"
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            Cấu hình hệ thống và tùy chỉnh nền tảng
          </p>
        </div>

        {activeTab !== 'logs' && (
          <button
            type="button"
            onClick={handleGeneralSave}
            disabled={loading || saving}
            className="
              flex shrink-0
              items-center justify-center
              gap-2 rounded-xl
              px-5 py-2.5
              text-sm font-semibold
              transition-opacity
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            style={{
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            {loading || saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}

            {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </button>
        )}
      </div>

      {/* =====================================================
          SUCCESS MESSAGE
      ====================================================== */}
      {saved && (
        <div
          className="
            mb-5 flex
            items-center gap-2.5
            rounded-xl border
            px-4 py-3
            text-sm
          "
          style={{
            background: 'var(--success-light)',
            borderColor: 'var(--success)',
            color: 'var(--success)',
          }}
        >
          <CheckCircle size={16} />

          <span>Thông tin cấu hình đã được lưu vào Database thành công!</span>
        </div>
      )}

      {/* =====================================================
          MAIN
      ====================================================== */}
      <div
        className="
          flex flex-col
          gap-5 pb-20
          md:flex-row
        "
      >
        {/* Sidebar */}
        <SettingsTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Content */}
        <main
          className="
            min-w-0
            max-w-5xl flex-1
          "
        >
          {/* =================================================
              GENERAL
          ================================================== */}
          {activeTab === 'general' && <GeneralSettings info={info} onChange={handleChange} />}

          {/* =================================================
              NOTIFICATION
          ================================================== */}
          {activeTab === 'notification' && (
            <EmptyTab
              title="Thông báo"
              description="
                Cấu hình thông báo hệ thống.
              "
            />
          )}

          {/* =================================================
              SECURITY
          ================================================== */}
          {activeTab === 'security' && (
            <EmptyTab
              title="Bảo mật"
              description="
                Cấu hình bảo mật hệ thống.
              "
            />
          )}

          {/* =================================================
              APPEARANCE
          ================================================== */}
          {activeTab === 'appearance' && (
            <EmptyTab
              title="Giao diện"
              description="
                Cấu hình giao diện hệ thống.
              "
            />
          )}

          {/* =================================================
              LOGS
          ================================================== */}
          {activeTab === 'logs' && <SystemLogs />}
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY TAB
========================================================= */

function EmptyTab({ title, description }: { title: string; description: string }) {
  return (
    <div
      className="
        rounded-2xl border p-6
      "
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      <h2
        className="
          mb-2 font-display
          font-semibold
        "
        style={{
          color: 'var(--text)',
        }}
      >
        {title}
      </h2>

      <p
        className="text-sm"
        style={{
          color: 'var(--text-secondary)',
        }}
      >
        {description}
      </p>
    </div>
  );
}
