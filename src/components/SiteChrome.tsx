export function SiteHeader({ onAction }: { onAction?: (action: string) => void }) {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 md:py-6">
      <div className="flex items-center gap-2 text-[var(--color-end)]">
        <span className="text-sm font-semibold lowercase tracking-tight">learn by Quing</span>
      </div>
      <nav className="hidden items-center gap-6 text-xs text-[var(--color-ocean)] md:flex">
        <a href="#features" className="hover:text-[var(--color-end)]">features</a>
        <a href="#workflow" className="hover:text-[var(--color-end)]">workflow</a>
        <a href="#sources" className="hover:text-[var(--color-end)]">sources</a>
        <a href="#manifesto" className="hover:text-[var(--color-end)]">manifesto</a>
      </nav>
      <button
        onClick={() => onAction?.('login')}
        className="text-xs text-[var(--color-end)] underline-offset-4 hover:underline"
      >
        sign in
      </button>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mt-12 border-t border-[var(--color-cornflower)]/60">
      <div className="flex flex-col gap-3 px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-[var(--color-ocean)] md:flex-row md:items-center md:justify-between md:px-12">
        <div className="flex items-center gap-2">
          <span>© 2026 Quing</span>
          <span className="opacity-50">·</span>
          <span>boilerplate for greatness</span>
        </div>
        <div className="flex items-center gap-4">
          <span>learn.quing</span>
          <span className="opacity-50">·</span>
          <span>v1</span>
        </div>
      </div>
    </footer>
  );
}
