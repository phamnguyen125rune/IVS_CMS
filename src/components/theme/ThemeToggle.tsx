'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Chuyển đổi giao diện sáng tối"
      className="
        flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        rounded-lg
        p-2
        transition-colors
        hover:bg-[var(--hover)]
        hover:text-[var(--primary)]
      "
      style={{
        color: 'var(--text)',
      }}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
