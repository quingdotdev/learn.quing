import { StarField } from "./StarField";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onBack?: () => void;
};

export function AuthShell({ title, subtitle, children, footer, onBack }: Props) {
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-[var(--color-start)] px-6">
      <StarField className="absolute inset-0 h-full w-full opacity-60" constellation={false} />
      <div className="relative z-10 w-full max-w-[22rem]">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-[var(--color-end)]">
          <span className="text-sm font-semibold lowercase">learn by Quing</span>
        </button>
        <h1 className="text-2xl text-[var(--color-end)]">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--color-ocean)]">{subtitle}</p>
        )}
        <div className="mt-6 space-y-3">{children}</div>
        {footer && (
          <div className="mt-6 text-xs text-[var(--color-ocean)]">{footer}</div>
        )}
      </div>
    </div>
  );
}

export function Field({
  label,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-widest text-[var(--color-ocean)]">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-[0.5rem] border border-[var(--color-cornflower)] bg-transparent px-3 py-2 text-sm text-[var(--color-end)] outline-none transition-colors duration-500 focus:border-[var(--color-end)]"
        style={{ transitionTimingFunction: "var(--ease-quing)" }}
      />
    </label>
  );
}

export function PrimaryButton({
  children,
  type = "button",
  onClick,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full rounded-[0.5rem] border border-[var(--color-end)] bg-[var(--color-end)] py-2 text-xs lowercase text-[var(--color-start)] transition-colors duration-500 hover:bg-transparent hover:text-[var(--color-end)]"
      style={{ transitionTimingFunction: "var(--ease-quing)" }}
    >
      {children}
    </button>
  );
}

import { useAuth } from "@workos-inc/authkit-react";

export function GoogleButton() {
  const { signIn } = useAuth();
  return (
    <button
      type="button"
      onClick={() => void signIn()}
      className="flex w-full items-center justify-center gap-2 rounded-[0.5rem] border border-[var(--color-cornflower)] py-2 text-xs lowercase text-[var(--color-end)] transition-colors duration-500 hover:border-[var(--color-end)]"
      style={{ transitionTimingFunction: "var(--ease-quing)" }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.95l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
      </svg>
      continue with google
    </button>
  );
}
