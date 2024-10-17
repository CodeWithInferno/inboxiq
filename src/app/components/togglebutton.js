// components/ThemeToggle.js
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';  // Import sun and moon icons

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // To prevent hydration mismatch
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        aria-label="Toggle Dark Mode"
        className="p-2 rounded-full transition-all duration-300"
      >
        {theme === 'light' ? (
          <FiMoon className="w-6 h-6 text-gray-800 dark:text-gray-100" />  // Moon icon for dark mode
        ) : (
          <FiSun className="w-6 h-6 text-gray-800 dark:text-gray-100" />   // Sun icon for light mode
        )}
      </button>
    </div>
  );
}
