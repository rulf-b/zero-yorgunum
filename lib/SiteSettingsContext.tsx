'use client';

import React, { createContext, useContext } from 'react';

export type SiteSettings = Record<string, any> | null;

type SiteSettingsContextType = SiteSettings;

const SiteSettingsContext = createContext<SiteSettingsContextType>(null);

export function SiteSettingsProvider({ value, children }: { value: SiteSettings; children: React.ReactNode }) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}


