import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import '@/styles/globals.css';

/**
 * Root layout.
 *
 * The `<html>` element lives in `src/app/[locale]/layout.tsx` because `lang`
 * and `dir` depend on the active locale. This layout only carries global
 * metadata that does not depend on the locale.
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  applicationName: 'Swim Fit Academy',
  authors: [{ name: 'Swim Fit Academy' }],
  creator: 'Swim Fit Academy',
  formatDetection: { telephone: true, address: false, email: false },
  robots: { index: true, follow: true },
  icons: {
    // The night badge is the primary favicon: it is legible at 16px on both
    // light and dark browser chrome.
    icon: [
      { url: '/media/brand/logo-night-badge-tight.png', type: 'image/png', sizes: '800x800' },
    ],
    apple: [{ url: '/apple-icon' }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#eef8fc' },
    { media: '(prefers-color-scheme: dark)', color: '#03131f' },
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return children;
}