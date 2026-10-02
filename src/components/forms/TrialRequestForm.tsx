'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useForm, type SubmitErrorHandler } from 'react-hook-form';
import { z } from 'zod';

import { TrialHandoff, WhatsAppButton } from '@/components/ui/ContactActions';
import { buildTrialMessage, CONTACT_LANGUAGES, LEVELS, SWIMMER_TYPES, type MessageLocale, type TrialRequestInput } from '@/lib/messages';
import { attributionParams, track } from '@/lib/analytics';
import { readUtmFromLocation, type UtmParams } from '@/lib/utm';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

/* -------------------------------------------------------------------------- */
/* Schema                                                                    */
/* -------------------------------------------------------------------------- */

const digitsOnly = (value: string) => value.replace(/\D/g, '');

const trialSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .min(1)
    .refine((value) => digitsOnly(value).length >= 8, 'phoneInvalid'),
  swimmerType: z.enum(SWIMMER_TYPES),
  level: z.enum(LEVELS),
  language: z.enum(CONTACT_LANGUAGES),
  notes: z.string().trim().max(320).optional().or(z.literal('')),
  consent: z.boolean().refine((value) => value === true, { message: 'consentRequired' }),
});

type TrialFormValues = z.infer<typeof trialSchema>;

/* -------------------------------------------------------------------------- */
/* Component                                                                 */
/* -------------------------------------------------------------------------- */

export interface TrialRequestFormProps {
  /** Program that sent the visitor here, when known. */
  readonly program?: TrialRequestInput['program'];
  readonly surface?: string;
  readonly tone?: 'deep' | 'light';
}

/**
 * Trial request form.
 *
 * Validates with Zod, keeps every entered value on failure, and hands off to
 * WhatsApp with a fully prepared message. Nothing is transmitted to a server and
 * nothing is stored — the visitor's own WhatsApp client carries the message.
 */
export function TrialRequestForm({
  program,
  surface = 'contact',
  tone = 'deep',
}: TrialRequestFormProps) {
  const t = useTranslations();
  const locale = useLocale() as MessageLocale;
  const light = tone === 'light';
  const started = useRef(false);
  const [utm, setUtm] = useState<UtmParams>({});
  const [prepared, setPrepared] = useState<{ href: string; input: TrialRequestInput } | null>(null);
  const [failed, setFailed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrialFormValues>({
    resolver: zodResolver(trialSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      phone: '',
      swimmerType: undefined as unknown as TrialFormValues['swimmerType'],
      level: undefined as unknown as TrialFormValues['level'],
      language: undefined as unknown as TrialFormValues['language'],
      notes: '',
      consent: false,
    },
  });

  const resolvedProgram = useMemo(
    () => program ?? (locale === 'ar' ? 'start' : 'start'),
    [program, locale],
  );

  const onFirstInteraction = useCallback(() => {
    if (started.current) return;
    started.current = true;
    setUtm(readUtmFromLocation());
    track('trial_form_start', attributionParams(locale, surface, 'trial_form', readUtmFromLocation()));
  }, [locale, surface]);

  const buildPayload = useCallback(
    (values: TrialFormValues): { href: string; input: TrialRequestInput } => {
      const input: TrialRequestInput = {
        name: values.name.trim(),
        phone: values.phone.trim(),
        swimmerType: values.swimmerType,
        level: values.level,
        language: values.language,
        notes: values.notes?.trim() ? values.notes.trim() : undefined,
        consent: values.consent === true,
        program: resolvedProgram,
      };
      return { href: buildWhatsAppUrl(buildTrialMessage(input, locale, utm)), input };
    },
    [locale, utm, resolvedProgram],
  );

  const onValid: (values: TrialFormValues) => void = useCallback(
    (values) => {
      const payload = buildPayload(values);
      setPrepared(payload);
      setFailed(false);
      track('trial_form_submit', {
        ...attributionParams(locale, surface, 'trial_form', readUtmFromLocation()),
        formState: 'valid',
        program: resolvedProgram,
      });
      // Open WhatsApp with the prepared message. If the popup is blocked the
      // success state still exposes the same link as a direct fallback.
      try {
        window.open(payload.href, '_blank', 'noopener,noreferrer');
      } catch {
        // no-op: the success state carries the fallback link.
      }
    },
    [buildPayload, locale, surface, resolvedProgram],
  );

  const onInvalid: SubmitErrorHandler<TrialFormValues> = useCallback(() => {
    setFailed(true);
    track('trial_form_submit', {
      ...attributionParams(locale, surface, 'trial_form', readUtmFromLocation()),
      formState: 'invalid',
    });
  }, [locale, surface]);

  /* ---------------------------------------------------------- success */

  if (prepared) {
    return (
      <div
        role="status"
        data-testid="trial-form-success"
        className={[
          'flex flex-col gap-5 rounded-[1.5rem] border p-6 sm:p-8',
          light ? 'border-ocean-500/12 bg-white/80' : 'border-pool-300/16 bg-ocean-900/50',
        ].join(' ')}
      >
        <h3 className="text-[1.15rem] font-semibold text-ice-50">{t('form.successTitle')}</h3>
        <p className="max-w-[52ch] text-[0.93rem] leading-relaxed text-slate-300">{t('form.successBody')}</p>
        <TrialHandoff
          input={prepared.input}
          surface={surface}
          size="lg"
          label={t('form.submit')}
        />
        <details className="text-[0.82rem] text-slate-500">
          <summary className="cursor-pointer select-none">{t('form.optional')}</summary>
          <pre
            dir="auto"
            className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl border border-pool-300/12 bg-ocean-950/60 p-4 text-[0.78rem] leading-relaxed text-ice-100"
          >
            {buildTrialMessage(prepared.input, locale, utm)}
          </pre>
        </details>
      </div>
    );
  }

  /* ------------------------------------------------------------- form */

  const selectClass = [
    'w-full appearance-none rounded-xl border px-4 py-3 text-[0.95rem] transition-colors',
    light
      ? 'border-ocean-500/15 bg-white text-ocean-950'
      : 'border-pool-300/18 bg-ocean-950/60 text-ice-50',
  ].join(' ');

  const inputClass = [
    'w-full rounded-xl border px-4 py-3 text-[0.95rem] transition-colors',
    light
      ? 'border-ocean-500/15 bg-white text-ocean-950 placeholder:text-slate-500'
      : 'border-pool-300/18 bg-ocean-950/60 text-ice-50 placeholder:text-slate-600',
  ].join(' ');

  return (
    <form
      noValidate
      onFocusCapture={onFirstInteraction}
      onSubmit={handleSubmit(onValid, onInvalid)}
      data-testid="trial-request-form"
      className={[
        'flex flex-col gap-5 rounded-[1.5rem] border p-6 sm:p-8',
        light ? 'border-ocean-500/12 bg-white/80' : 'border-pool-300/14 bg-ocean-900/45',
      ].join(' ')}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="trial-name"
          label={t('form.name')}
          error={errors.name ? t('form.validation.nameRequired') : undefined}
        >
          <input
            id="trial-name"
            type="text"
            autoComplete="name"
            placeholder={t('form.namePlaceholder')}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'trial-name-error' : undefined}
            className={inputClass}
            {...register('name')}
          />
        </Field>

        <Field
          id="trial-phone"
          label={t('form.phone')}
          error={
            errors.phone
              ? errors.phone.type === 'too_small'
                ? t('form.validation.phoneRequired')
                : t('form.validation.phoneInvalid')
              : undefined
          }
        >
          <input
            id="trial-phone"
            type="tel"
            inputMode="tel"
            dir="ltr"
            autoComplete="tel"
            placeholder={t('form.phonePlaceholder')}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? 'trial-phone-error' : undefined}
            className={inputClass}
            {...register('phone')}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field id="trial-swimmer" label={t('options.swimmerType.label')} error={errors.swimmerType ? t('form.validation.swimmerRequired') : undefined}>
          <select id="trial-swimmer" aria-invalid={errors.swimmerType ? true : undefined} className={selectClass} defaultValue="" {...register('swimmerType')}>
            <option value="" disabled>
              —
            </option>
            {SWIMMER_TYPES.map((value) => (
              <option key={value} value={value}>
                {t(`options.swimmerType.${value}`)}
              </option>
            ))}
          </select>
        </Field>

        <Field id="trial-level" label={t('options.level.label')} error={errors.level ? t('form.validation.levelRequired') : undefined}>
          <select id="trial-level" aria-invalid={errors.level ? true : undefined} className={selectClass} defaultValue="" {...register('level')}>
            <option value="" disabled>
              —
            </option>
            {LEVELS.map((value) => (
              <option key={value} value={value}>
                {t(`options.level.${value}`)}
              </option>
            ))}
          </select>
        </Field>

        <Field id="trial-language" label={t('options.language.label')} error={errors.language ? t('form.validation.languageRequired') : undefined}>
          <select id="trial-language" aria-invalid={errors.language ? true : undefined} className={selectClass} defaultValue="" {...register('language')}>
            <option value="" disabled>
              —
            </option>
            {CONTACT_LANGUAGES.map((value) => (
              <option key={value} value={value}>
                {t(`options.language.${value}`)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="trial-notes" label={`${t('form.notes')} (${t('form.optional')})`} error={errors.notes ? t('form.validation.notesShort') : undefined}>
        <textarea
          id="trial-notes"
          rows={3}
          placeholder={t('form.notesPlaceholder')}
          aria-invalid={errors.notes ? true : undefined}
          className={`${inputClass} resize-y`}
          {...register('notes')}
        />
      </Field>

      <div>
        <label htmlFor="trial-consent" className="flex cursor-pointer items-start gap-3 text-[0.86rem] leading-relaxed text-slate-300">
          <input
            id="trial-consent"
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-pool-400"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? 'trial-consent-error' : undefined}
            {...register('consent')}
          />
          <span>{t('form.consent')}</span>
        </label>
        {errors.consent ? (
          <p id="trial-consent-error" role="alert" className="mt-2 text-[0.8rem] text-pool-200">
            {t('form.validation.consentRequired')}
          </p>
        ) : null}
      </div>

      {failed ? (
        <div role="alert" data-testid="trial-form-error" className="rounded-xl border border-pool-300/25 bg-pool-400/10 p-4">
          <p className="text-[0.9rem] font-semibold text-ice-50">{t('form.errorTitle')}</p>
          <p className="mt-1.5 text-[0.85rem] leading-relaxed text-slate-300">{t('form.errorBody')}</p>
          <WhatsAppButton
            label={t('form.fallbackTitle')}
            variant="ghost"
            size="sm"
            surface="trial_form_error"
            className="mt-3.5"
          />
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        data-testid="trial-form-submit"
        className="btn btn-primary w-full py-3.5 sm:w-auto sm:self-start"
      >
        {isSubmitting ? t('form.submitting') : t('form.submit')}
      </button>

      <p className="text-[0.78rem] leading-relaxed text-slate-600">{t('form.fallbackBody')}</p>
    </form>
  );
}

/* -------------------------------------------------------------------------- */

function Field({
  id,
  label,
  error,
  children,
}: {
  readonly id: string;
  readonly label: string;
  readonly error?: string;
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[0.82rem] font-medium text-ice-100">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-[0.78rem] text-pool-200">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default TrialRequestForm;