interface ScreenFlowLogoProps {
  className?: string;
}

export function ScreenFlowLogo({ className }: ScreenFlowLogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3.5" />
      <path d="M10.7 11.3l3 1.7-3 1.7v-3.4z" fill="currentColor" stroke="none" />
    </svg>
  );
}
