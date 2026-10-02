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
    icon: [{ url: '/brand/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon' }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#03131f' },
    { media: '(prefers-color-scheme: light)', color: '#03131f' },
  ],
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return children;
}