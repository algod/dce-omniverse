'use client';

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { zsColors } from '@/lib/design-system/zs-colors';

export function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="fixed top-6 right-6 p-3 rounded-lg shadow-md transition-all hover:shadow-lg z-40"
      style={{
        backgroundColor: darkMode ? zsColors.neutral.charcoal : zsColors.neutral.white,
        border: `1px solid ${darkMode ? zsColors.neutral.gray : zsColors.neutral.lightGray}`
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 360 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {darkMode ? (
          <Moon size={20} style={{ color: zsColors.secondary.orange }} />
        ) : (
          <Sun size={20} style={{ color: zsColors.secondary.orange }} />
        )}
      </motion.div>
    </motion.button>
  );
}