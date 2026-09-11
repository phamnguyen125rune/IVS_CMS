'use client';

import type { SettingsTabKey } from './constants/settings.constants';

import { SETTINGS_TABS } from './constants/settings.constants';

interface SettingsTabsProps {
  activeTab: SettingsTabKey;
  onChange: (tab: SettingsTabKey) => void;
}

export default function SettingsTabs({ activeTab, onChange }: SettingsTabsProps) {
  return (
    <aside
      className="
        w-full shrink-0
        md:w-52
      "
    >
      <nav className="space-y-1">
        {SETTINGS_TABS.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className="
                  flex w-full
                  items-center gap-3
                  rounded-xl px-3 py-2.5
                  text-left text-sm
                  font-medium
                  transition-colors
                "
              style={{
                background: isActive ? 'var(--primary-light)' : 'transparent',

                color: isActive ? 'var(--primary-text)' : 'var(--text-secondary)',
              }}
            >
              <Icon size={16} />

              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
