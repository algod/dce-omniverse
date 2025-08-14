'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users2 } from 'lucide-react';
import { useUserMode } from '@/lib/contexts/UserModeContext';
import { zsColors } from '@/lib/design-system/zs-colors';

export function UserModeToggle() {
  const { userMode, setUserMode } = useUserMode();

  return (
    <div className="flex items-center gap-6 p-4 rounded-xl bg-white shadow-md">
      <span className="text-sm font-medium" style={{ color: zsColors.neutral.darkGray }}>
        User Type:
      </span>
      
      <div className="flex items-center gap-2 p-1 rounded-lg" 
        style={{ backgroundColor: zsColors.neutral.offWhite }}>
        
        {/* HQ User Button */}
        <motion.button
          onClick={() => setUserMode('HQ')}
          className="relative px-4 py-2 rounded-md flex items-center gap-2 transition-all"
          style={{
            backgroundColor: userMode === 'HQ' ? zsColors.primary.navy : 'transparent',
            color: userMode === 'HQ' ? 'white' : zsColors.neutral.gray
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Building2 size={18} />
          <span className="font-medium">HQ User</span>
          {userMode === 'HQ' && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute inset-0 rounded-md"
              style={{ 
                backgroundColor: zsColors.primary.navy,
                zIndex: -1
              }}
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>

        {/* Field User Button */}
        <motion.button
          onClick={() => setUserMode('Field')}
          className="relative px-4 py-2 rounded-md flex items-center gap-2 transition-all"
          style={{
            backgroundColor: userMode === 'Field' ? zsColors.secondary.green : 'transparent',
            color: userMode === 'Field' ? 'white' : zsColors.neutral.gray
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Users2 size={18} />
          <span className="font-medium">Field User</span>
          {userMode === 'Field' && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute inset-0 rounded-md"
              style={{ 
                backgroundColor: zsColors.secondary.green,
                zIndex: -1
              }}
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      </div>

      {/* Mode Description */}
      <div className="flex-1">
        <p className="text-xs" style={{ color: zsColors.neutral.gray }}>
          {userMode === 'HQ' 
            ? 'Access to all planning and orchestration agents'
            : 'Access to Field Copilot for real-time assistance'}
        </p>
      </div>
    </div>
  );
}