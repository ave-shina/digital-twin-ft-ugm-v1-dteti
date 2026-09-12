/**
 * Konteks pengaturan situs (SEO, teks loading, catatan peta, langkah
 * tutorial) yang berasal dari Prismic. Nilai bawaan = konten cadangan.
 */
import { createContext, useContext, type ReactNode } from 'react'

import { DEFAULT_SETTINGS } from '@/lib/prismic/settings-default'
import type { SiteSettings } from '@/types/prismic'

const SettingsContext = createContext<SiteSettings>(DEFAULT_SETTINGS.settings)

export function SettingsProvider({ settings, children }: { settings?: SiteSettings | null; children: ReactNode }) {
  return <SettingsContext.Provider value={settings ?? DEFAULT_SETTINGS.settings}>{children}</SettingsContext.Provider>
}

export function useSettings(): SiteSettings {
  return useContext(SettingsContext)
}
