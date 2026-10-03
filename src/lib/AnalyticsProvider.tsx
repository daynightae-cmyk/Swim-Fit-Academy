'use client';

import { useEffect } from 'react';
import { track as vercelTrack } from '@vercel/analytics';

import { setAnalyticsBridge } from './analytics';

/**
 * Analytics bridge.
 *
 * Wires the typed event surface to Vercel Analytics and stays a no-op when the
 * runtime is unavailable. Only allow-listed scalar payloads are forwarded, and
 * conversation text is never included.
 */
export function AnalyticsProvider() {
  useEffect(() => {
    setAnalyticsBridge({
      track(event, params) {
        try {
          vercelTrack(event, params as Record<string, string>);
        } catch {
          // Analytics must never break a journey.
        }
      },
    });
    return () => setAnalyticsBridge(null);
  }, []);

  return null;
}

export default AnalyticsProvider;
