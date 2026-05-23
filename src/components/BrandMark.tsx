type Props = { className?: string; size?: number; hideLines?: boolean };

/** Six-point Quing constellation glyph. */
export function BrandMark({ className, size = 22, hideLines = false }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {!hideLines && (
        <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
          <line x1="20" y1="4" x2="36" y2="14" />
          <line x1="36" y1="14" x2="36" y2="28" />
          <line x1="36" y1="28" x2="20" y2="36" />
          <line x1="20" y1="36" x2="4" y2="28" />
          <line x1="4" y1="28" x2="4" y2="14" />
          <line x1="4" y1="14" x2="20" y2="4" />
          <line x1="20" y1="4" x2="20" y2="36" />
          <line x1="4" y1="14" x2="36" y2="28" />
          <line x1="36" y1="14" x2="4" y2="28" />
        </g>
      )}
      <g fill="currentColor">
        <circle cx="20" cy="4" r="1.6" />
        <circle cx="36" cy="14" r="1.6" />
        <circle cx="36" cy="28" r="1.6" />
        <circle cx="20" cy="36" r="1.6" />
        <circle cx="4" cy="28" r="1.6" />
        <circle cx="4" cy="14" r="1.6" />
        <circle cx="20" cy="20" r="1.4" />
      </g>
    </svg>
  );
}
