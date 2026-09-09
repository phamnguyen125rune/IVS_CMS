'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Chuyển đổi giao diện sáng tối"
        className="
          p-2
          rounded-lg
          transition-colors
          hover:bg-[var(--hover)]
          hover:text-[var(--primary)]
        "
        style={{
          color: 'var(--text)',
        }}
      >
        <Moon size={18} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Chuyển đổi giao diện sáng tối"
      className="
        p-2
        rounded-lg
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
