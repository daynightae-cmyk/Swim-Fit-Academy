import { describe, expect, it } from 'vitest';

import { DEFAULT_THEME, THEME_BOOTSTRAP_SCRIPT } from '@/lib/theme';

describe('product theme default', () => {
  it('opens new visitors in night mode independent of OS preference', () => {
    expect(DEFAULT_THEME).toBe('night');
    expect(THEME_BOOTSTRAP_SCRIPT).not.toContain('prefers-color-scheme');
    expect(THEME_BOOTSTRAP_SCRIPT).toContain("?s:'night';");
  });
});
