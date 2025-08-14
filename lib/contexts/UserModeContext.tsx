'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserMode = 'HQ' | 'Field';

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  isAgentEnabled: (agentId: string) => boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export function UserModeProvider({ children }: { children: ReactNode }) {
  const [userMode, setUserMode] = useState<UserMode>('HQ');

  const isAgentEnabled = (agentId: string): boolean => {
    if (userMode === 'HQ') {
      // In HQ mode, all agents except Field Copilot are enabled
      return agentId !== 'copilot';
    } else {
      // In Field mode, only Field Copilot is enabled
      return agentId === 'copilot';
    }
  };

  return (
    <UserModeContext.Provider value={{ userMode, setUserMode, isAgentEnabled }}>
      {children}
    </UserModeContext.Provider>
  );
}

export function useUserMode() {
  const context = useContext(UserModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
}