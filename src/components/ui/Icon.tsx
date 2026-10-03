import type { SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement> & { readonly size?: number };

function Base({ size = 20, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Contact + brand icons                                                       */
/* -------------------------------------------------------------------------- */

export function WhatsAppIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12.04 2.5c-5.24 0-9.5 4.24-9.5 9.46 0 1.67.44 3.3 1.27 4.73L2.5 21.5l4.94-1.28a9.53 9.53 0 0 0 4.6 1.17c5.24 0 9.5-4.24 9.5-9.46S17.28 2.5 12.04 2.5Z" />
      <path d="M8.72 7.6c-.2-.44-.4-.45-.6-.46h-.5c-.17 0-.45.06-.69.31-.24.25-.9.88-.9 2.15s.92 2.5 1.05 2.67c.13.17 1.79 2.87 4.44 3.91 2.2.87 2.65.7 3.13.65.48-.04 1.55-.63 1.77-1.24.22-.61.22-1.14.15-1.25-.06-.11-.24-.17-.49-.3-.24-.13-1.55-.77-1.79-.85-.24-.09-.42-.13-.6.13-.17.25-.66.85-.81 1.02-.15.17-.3.2-.55.07-.24-.13-1.03-.38-1.97-1.21-.73-.65-1.22-1.45-1.36-1.7-.15-.24-.02-.37.11-.5.11-.11.24-.3.36-.45.12-.15.16-.25.24-.42.08-.17.04-.31-.02-.44-.06-.13-.6-1.46-.82-2Z" />
    </Base>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4.2 4.9c.5-.6 1.35-.7 1.95-.3l1.7 1.15c.55.37.72 1.1.4 1.7l-.6 1.1c.85 1.7 2 3.1 3.45 4.45l1.1-.6c.6-.32 1.33-.15 1.7.4l1.15 1.7c.4.6.3 1.45-.3 1.95-.7.6-1.7.8-2.6.5-3.9-1.3-7.3-3.9-10-7.6C1.9 8.6 1.9 6.5 2.5 5.3c.2-.4.4-.5.7-.4Z" />
    </Base>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M14.2 8.4h2.1V5.2h-2.4c-2.2 0-3.5 1.4-3.5 3.5v1.6H8.2v3.2h2.2V21h3.3v-7.5h2.3l.4-3.2h-2.7V9.2c0-.5.2-.8.5-.8Z" />
    </Base>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.1" cy="6.9" r="1.05" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 6 18 18M18 6 6 18" />
    </Base>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3.5 7h17M3.5 12h17M3.5 17h11" />
    </Base>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4.2 11.9 20 4.5l-7.4 15.8-1.9-6.5-6.5-1.9Z" />
      <path d="M10.7 13.8 20 4.5" />
    </Base>
  );
}

export function ChevronIcon({ direction = 'down', ...props }: IconProps & { direction?: 'down' | 'up' }) {
  return (
    <Base {...props}>
      {direction === 'down' ? <path d="m6 9.5 6 6 6-6" /> : <path d="m6 14.5 6-6 6 6" />}
    </Base>
  );
}

export function ArrowIcon({ direction = 'start', ...props }: IconProps & { direction?: 'start' | 'end' | 'down' }) {
  const rotation = direction === 'end' ? 'rotate(180 12 12)' : direction === 'down' ? 'rotate(90 12 12)' : undefined;
  return (
    <Base {...props}>
      <g transform={rotation}>
        <path d="M20 12H4.5" />
        <path d="m10.5 6-6 6 6 6" />
      </g>
    </Base>
  );
}

export function MicIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="9.2" y="2.8" width="5.6" height="10.6" rx="2.8" />
      <path d="M5.6 11.2a6.4 6.4 0 0 0 12.8 0" />
      <path d="M12 17.6v3.6" />
    </Base>
  );
}

export function SpeakerIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 9.5h3.4L12 5.4v13.2L7.4 14.5H4Z" />
      <path d="M15.8 9.2a4 4 0 0 1 0 5.6" />
      <path d="M18.4 6.6a7.6 7.6 0 0 1 0 10.8" />
    </Base>
  );
}

export function StopIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="6.5" y="6.5" width="11" height="11" rx="2.4" />
    </Base>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 2.8 4.8 5.4v5.4c0 4.4 3 8.2 7.2 9.4 4.2-1.2 7.2-5 7.2-9.4V5.4Z" />
      <path d="m9 11.8 2.2 2.2 4-4.2" />
    </Base>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3.2c.7 3.9 2.1 5.6 6 6.4-3.9.8-5.3 2.5-6 6.4-.7-3.9-2.1-5.6-6-6.4 3.9-.8 5.3-2.5 6-6.4Z" />
      <path d="M17.8 15.6c.3 1.6.9 2.3 2.5 2.7-1.6.4-2.2 1.1-2.5 2.7-.3-1.6-.9-2.3-2.5-2.7 1.6-.4 2.2-1.1 2.5-2.7Z" />
    </Base>
  );
}

/* -------------------------------------------------------------------------- */
/* Skill iconography — lanes, breathing, stroke mechanics                     */
/* -------------------------------------------------------------------------- */

export type SkillIconName =
  | 'entry'
  | 'align'
  | 'lungs'
  | 'kick'
  | 'rhythm'
  | 'flow'
  | 'arrow'
  | 'balance'
  | 'efficiency';

export function SkillIcon({ name, ...props }: IconProps & { readonly name: SkillIconName }) {
  switch (name) {
    case 'entry':
      return (
        <Base {...props}>
          <path d="M3 18c3.2-3.6 5.8-5.4 9-5.4S17.8 14.4 21 18" />
          <path d="M12 12.6V4.4M9 7.4 12 4.4l3 3" />
        </Base>
      );
    case 'align':
      return (
        <Base {...props}>
          <path d="M2.6 12h18.8" strokeDasharray="3 3" />
          <path d="M6.4 8.6h11.2M8.6 12h6.8M10.8 15.4h2.4" />
        </Base>
      );
    case 'lungs':
      return (
        <Base {...props}>
          <path d="M12 3.6v7.2" />
          <path d="M12 10.8c-1.3-2-3-2.9-4.3-2.4-1.3.5-1.8 2-2.1 4-.3 2.1-.3 4.6.6 5.6 1 1.1 3.3.6 5.8-.6Z" />
          <path d="M12 10.8c1.3-2 3-2.9 4.3-2.4 1.3.5 1.8 2 2.1 4 .3 2.1.3 4.6-.6 5.6-1 1.1-3.3.6-5.8-.6Z" />
        </Base>
      );
    case 'kick':
      return (
        <Base {...props}>
          <path d="M3 17c3.6 0 5.4-2 7.2-5.4" />
          <path d="M10.2 11.6c1.6-3.2 4-5 7.4-5" />
          <path d="M3 20.6c4.4 0 6.8-2.4 9-6.4" opacity={0.55} />
        </Base>
      );
    case 'rhythm':
      return (
        <Base {...props}>
          <path d="M3 14.4h3l2-6 3 11 3-13 2.6 8H21" />
        </Base>
      );
    case 'flow':
      return (
        <Base {...props}>
          <path d="M3 8.4c3.6-2.6 6.4-2.6 9 0s5.4 2.6 9 0" />
          <path d="M3 13.2c3.6-2.6 6.4-2.6 9 0s5.4 2.6 9 0" opacity={0.7} />
          <path d="M3 18c3.6-2.6 6.4-2.6 9 0s5.4 2.6 9 0" opacity={0.4} />
        </Base>
      );
    case 'arrow':
      return (
        <Base {...props}>
          <path d="M3.4 12h17" />
          <path d="m14.6 6.4 5.8 5.6-5.8 5.6" />
          <path d="M3.4 7.4h6M3.4 16.6h6" opacity={0.5} />
        </Base>
      );
    case 'balance':
      return (
        <Base {...props}>
          <path d="M12 4.2v15.6" />
          <path d="M5 8.6h14" />
          <circle cx="12" cy="8.6" r="1.6" />
          <path d="M8.4 19.8 12 15l3.6 4.8" />
        </Base>
      );
    case 'efficiency':
      return (
        <Base {...props}>
          <circle cx="12" cy="12" r="8.4" opacity={0.45} />
          <path d="M12 6.6V12l3.6 2.4" />
          <path d="M12 3.6a8.4 8.4 0 0 1 6.2 2.8" />
        </Base>
      );
    default:
      return null;
  }
}