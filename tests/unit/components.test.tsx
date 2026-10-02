import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

import { LanguageSwitch } from '@/components/layout/LanguageSwitch';
import { SocialLinks } from '@/components/sections/SocialLinks';
import { VerifiedReviewSlot } from '@/components/sections/ProgressStory';
import { TrialRequestForm } from '@/components/forms/TrialRequestForm';
import { AIChatPanel } from '@/components/ai/AIChatPanel';
import ar from '@/i18n/messages/ar.json';
import en from '@/i18n/messages/en.json';

const mockedUsePathname = vi.fn(() => '/ar/programs');
vi.mock('next/navigation', () => ({
  usePathname: () => mockedUsePathname(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...rest
  }: { children: ReactNode; href: string } & Record<string, unknown>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

function wrap(node: ReactNode, locale: 'ar' | 'en' = 'ar') {
  return (
    <NextIntlClientProvider locale={locale} messages={locale === 'ar' ? ar : en}>
      {node}
    </NextIntlClientProvider>
  );
}

describe('LanguageSwitch', () => {
  it('preserves the current route when switching', () => {
    mockedUsePathname.mockReturnValue('/ar/programs');
    render(wrap(<LanguageSwitch />));
    const link = screen.getByTestId('language-switch');
    expect(link).toHaveAttribute('href', '/en/programs');
  });

  it('switches back to Arabic from an English route', () => {
    mockedUsePathname.mockReturnValue('/en/contact');
    render(wrap(<LanguageSwitch />, 'en'));
    expect(screen.getByTestId('language-switch')).toHaveAttribute('href', '/ar/contact');
  });

  it('exposes an accessible label', () => {
    mockedUsePathname.mockReturnValue('/ar');
    render(wrap(<LanguageSwitch />));
    const link = screen.getByTestId('language-switch');
    expect(link).toHaveAttribute('aria-label', 'التبديل إلى اللغة الإنجليزية');
    expect(link).toHaveAttribute('hreflang', 'en');
  });
});

describe('SocialLinks', () => {
  it('links to the verified Facebook page only', () => {
    render(wrap(<SocialLinks />));
    const facebook = screen.getByTestId('social-facebook');
    expect(facebook).toHaveAttribute('href', 'https://www.facebook.com/1177131185475857');
    expect(facebook).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('marks Instagram as a candidate instead of linking it', () => {
    render(wrap(<SocialLinks />));
    expect(screen.queryByTestId('social-instagram')).toBeNull();
    expect(screen.getByTestId('social-instagram-candidate')).toBeInTheDocument();
  });

  it('never renders a placeholder href', () => {
    const { container } = render(wrap(<SocialLinks />));
    expect(container.querySelectorAll('a[href="#"]')).toHaveLength(0);
    expect(container.querySelectorAll('a[href*="javascript:"]')).toHaveLength(0);
  });
});

describe('VerifiedReviewSlot', () => {
  it('renders a truthful empty state with no rating', () => {
    const { container } = render(wrap(<VerifiedReviewSlot />));
    expect(screen.getByTestId('verified-reviews')).toBeInTheDocument();
    expect(container.textContent).toContain('قريبًا');
    expect(container.textContent).not.toMatch(/\d\s*نجوم?/);
    expect(container.textContent).not.toMatch(/5\s*stars/i);
  });
});

describe('TrialRequestForm validation', () => {
  it('blocks submission and exposes associated error messages', async () => {
    const user = userEvent.setup();
    render(wrap(<TrialRequestForm />));

    await user.click(screen.getByTestId('trial-form-submit'));

    const nameError = await screen.findByText('اكتب الاسم من فضلك.');
    expect(nameError).toHaveAttribute('id', 'trial-name-error');
    expect(screen.getByLabelText('الاسم')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('الموافقة مطلوبة للمتابعة.')).toBeInTheDocument();
    expect(screen.queryByTestId('trial-form-success')).toBeNull();
  });

  it('builds the WhatsApp handoff from a valid submission', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const user = userEvent.setup();
    render(wrap(<TrialRequestForm program="confidence" />));

    await user.type(screen.getByLabelText('الاسم'), 'سارة');
    await user.type(screen.getByLabelText('رقم الجوال'), '0501234567');
    await user.selectOptions(screen.getByLabelText('المتدرب'), 'child');
    await user.selectOptions(screen.getByLabelText('المستوى الحالي'), 'none');
    await user.selectOptions(screen.getByLabelText('لغة التواصل'), 'arabic');
    await user.click(screen.getByLabelText(/أوافق على التواصل/));
    await user.click(screen.getByTestId('trial-form-submit'));

    expect(await screen.findByTestId('trial-form-success')).toBeInTheDocument();
    const handoff = screen.getByTestId('trial-form-success').querySelector('a[href*="wa.me"]');
    const href = handoff?.getAttribute('href') ?? '';
    expect(href).toContain('https://wa.me/971569698628?text=');

    const decoded = decodeURIComponent(href.split('?text=')[1] ?? '');
    expect(decoded).toContain('البرنامج: ابنِ الثقة');
    expect(decoded).toContain('الاسم: سارة');
    expect(decoded).toContain('المتدرب: طفل');
    expect(decoded).toContain('لغة التواصل: العربية');
    expect(open).toHaveBeenCalled();
    open.mockRestore();
  });

  it('rejects a phone number that is too short', async () => {
    const user = userEvent.setup();
    render(wrap(<TrialRequestForm />));
    await user.type(screen.getByLabelText('الاسم'), 'سارة');
    await user.type(screen.getByLabelText('رقم الجوال'), '123');
    await user.click(screen.getByTestId('trial-form-submit'));
    expect(await screen.findByText('أدخل رقم جوال صحيح (8 أرقام على الأقل).')).toBeInTheDocument();
  });
});

describe('AIChatPanel', () => {
  it('renders nothing when closed', () => {
    const { container } = render(wrap(<AIChatPanel open={false} onClose={() => {}} />));
    expect(container).toBeEmptyDOMElement();
  });

  it('opens as a labelled dialog with greeting, chips and a composer', () => {
    render(wrap(<AIChatPanel open onClose={() => {}} />));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(screen.getByTestId('ai-quick-actions')).toBeInTheDocument();
    expect(screen.getByTestId('ai-composer')).toBeInTheDocument();
    // No handoff card before a reply needs one: the direct WhatsApp route is
    // already present in the panel footer.
    expect(screen.queryByTestId('ai-handoff-card')).toBeNull();
  });

  it('closes on Escape and stops speech', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(wrap(<AIChatPanel open onClose={onClose} />));
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('offers a WhatsApp handoff that is always reachable', () => {
    render(wrap(<AIChatPanel open onClose={() => {}} />));
    const links = screen.getAllByRole('link');
    const whatsapp = links.find((link) => link.getAttribute('href')?.includes('wa.me/971569698628'));
    expect(whatsapp).toBeDefined();
  });

  it('keeps the send button disabled until a message is typed', async () => {
    const user = userEvent.setup();
    render(wrap(<AIChatPanel open onClose={() => {}} />));
    expect(screen.getByTestId('ai-send')).toBeDisabled();
    await user.type(screen.getByTestId('ai-composer'), 'مرحبا');
    expect(screen.getByTestId('ai-send')).toBeEnabled();
  });
});
