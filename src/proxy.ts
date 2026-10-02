import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';

/**
 * Locale routing proxy (Next 16 `proxy` convention, replacing `middleware`).
 * Ensures every public URL is locale-prefixed and that / redirects to /ar.
 */
export default createMiddleware(routing);

export const config = {
  matcher: [
    // Everything except API routes, Next internals and files with a real extension.
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};