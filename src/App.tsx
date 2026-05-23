import { startTransition, useState } from 'react'

import { type Surface } from './data/appData'
import { Workspace } from './components/Workspace'
import { StarField } from './components/StarField'
import { SiteHeader, SiteFooter } from './components/SiteChrome'
import { AuthShell, PrimaryButton, GoogleButton } from './components/AuthShell'
import { useAuth } from '@workos-inc/authkit-react'
import { useConvexAuth } from 'convex/react'

function LandingPage({ onSurfaceChange }: { onSurfaceChange: (surface: Surface) => void }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[var(--color-start)] text-[var(--color-charcoal)]">
      <StarField className="pointer-events-auto absolute inset-0 h-full w-full" constellation={false} />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <SiteHeader onAction={(action) => onSurfaceChange(action as Surface)} />

        {/* HERO */}
        <section className="relative px-6 pb-24 pt-16 md:px-12 md:pt-24">
          <div className="max-w-[42.5rem]">
            <h1 className="text-[2.75rem] leading-[1.02] tracking-tight text-[var(--color-end)] md:text-[4rem]">
              find understanding<br />faster.
            </h1>
            <p className="mt-6 max-w-[34rem] text-[15px] leading-relaxed text-[var(--color-charcoal)]">
              learn by Quing is a study workspace built for clarity. a quiet
              environment where notes, trusted educational videos and
              contextual lookups live together. focus on the work.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSurfaceChange('signup')}
                className="rounded-[0.5rem] border border-[var(--color-end)] bg-[var(--color-end)] px-4 py-2 text-xs font-medium lowercase text-[var(--color-start)] transition-colors duration-500 hover:bg-transparent hover:text-[var(--color-end)]"
                style={{ transitionTimingFunction: "var(--ease-quing)" }}
              >
                start studying
              </button>
              <button
                onClick={() => onSurfaceChange('workspace')}
                className="rounded-[0.5rem] border border-[var(--color-cornflower)] px-4 py-2 text-xs font-medium lowercase text-[var(--color-end)] transition-colors duration-500 hover:border-[var(--color-end)]"
                style={{ transitionTimingFunction: "var(--ease-quing)" }}
              >
                open workspace ↗
              </button>
            </div>
          </div>
        </section>

        {/* PRODUCT PREVIEW */}
        <section className="px-6 md:px-12">
          <ProductPreview />
        </section>

        {/* FEATURES */}
        <section id="features" className="px-6 py-24 md:px-12">
          <SectionLabel title="what's inside" />
          <div className="mt-10 grid gap-px border border-[var(--color-cornflower)]/60 bg-[var(--color-cornflower)]/60 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-[var(--color-start)] p-6 transition-colors duration-500 hover:bg-[var(--color-cornflower)]/15"
                style={{ transitionTimingFunction: "var(--ease-quing)" }}
              >
                <h3 className="text-lg text-[var(--color-end)]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-charcoal)]">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* WORKFLOW */}
        <section id="workflow" className="px-6 py-24 md:px-12">
          <SectionLabel title="a connected workflow" />
          <ol className="mt-10 max-w-[42.5rem] divide-y divide-[var(--color-cornflower)]/60 border-y border-[var(--color-cornflower)]/60">
            {workflow.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-4 py-6">
                <span className="font-mono text-xs text-[var(--color-ocean)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="text-base text-[var(--color-end)]">{step.title}</h4>
                  <p className="mt-1 text-sm text-[var(--color-charcoal)]">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <SiteFooter />
      </div>
    </div>
  )
}

function SectionLabel({ title }: { title: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <h2 className="text-2xl text-[var(--color-end)] md:text-3xl">{title}</h2>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-[1rem] border border-[var(--color-cornflower)] bg-[var(--color-start)]">
      <div className="flex items-center justify-between border-b border-[var(--color-cornflower)] px-4 py-2 text-[10px] uppercase tracking-widest text-[var(--color-ocean)]">
        <div className="flex items-center gap-2">
          <span>learn.quing / notes / biology</span>
        </div>
        <span>autosaved</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[12rem_1fr_18rem]">
        <aside className="hidden border-r border-[var(--color-cornflower)] p-4 text-[10px] md:block">
          <div className="uppercase tracking-widest text-[var(--color-ocean)] mb-4 font-bold">LIBRARY</div>
          <ul className="space-y-2 text-[var(--color-end)] lowercase">
            <li className="font-bold text-[var(--color-cornflower)]">· biology basics</li>
            <li className="text-[var(--color-ocean)]">· organic mechanisms</li>
            <li className="text-[var(--color-ocean)]">· linear algebra</li>
          </ul>
        </aside>
        <article className="q-prose p-8">
          <h1 className="text-2xl font-bold mb-4">photosynthesis systems</h1>
          <p>
            nucleophilic substitution can proceed via two pathways. the choice
            depends on substrate, nucleophile strength, and solvent. consider{" "}
            <mark>tertiary carbocations</mark>.
          </p>
          <div className="mt-8 border-l-2 border-[var(--color-cornflower)] pl-4 py-2 font-mono text-sm bg-[var(--color-cornflower)]/5">
            ## mechanisms recap
            * sn1 depends on cation stability
            * sn2 is a concerted step
          </div>
          <p className="mt-8 text-[var(--color-ocean)] text-xs italic">
            hover any phrase to bold, highlight, or search google, wikipedia, and youtube instantly.
          </p>
        </article>
        <aside className="hidden border-l border-[var(--color-cornflower)] p-6 md:block bg-[var(--color-cornflower)]/5">
          <div className="aspect-video rounded-[0.5rem] border border-[var(--color-cornflower)] bg-black shadow-lg" />
          <p className="mt-4 text-xs font-bold text-[var(--color-end)]">Intro to Bio lecture</p>
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[var(--color-cornflower)]/20 rounded-full text-[10px] font-bold text-[var(--color-cornflower)] shadow-sm">
              02:18 · splitting water
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[var(--color-cornflower)]/20 rounded-full text-[10px] font-bold text-[var(--color-cornflower)] shadow-sm">
              09:42 · atp transfer
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

const features = [
  {
    title: "hybrid notes",
    body: "write in raw markdown and see it format instantly as you move. the cleanest writing experience for serious study.",
  },
  {
    title: "embedded context",
    body: "bring youtube lectures directly into your notes with dynamic timestamps that jump to the exact moment.",
  },
  {
    title: "contextual lookup",
    body: "highlight any phrase to instantly search google, wikipedia, or youtube without ever leaving your workspace.",
  },
  {
    title: "simple uploads",
    body: "drop in your lecture slides and pdfs. keep your source material linked directly to your active notes.",
  },
  {
    title: "autosave & sync",
    body: "powered by convex for real-time persistence. your work is safe and always exactly where you left it.",
  },
  {
    title: "minimalist aesthetic",
    body: "a quiet, high-contrast environment designed to minimize distractions and maximize deep work.",
  },
];

const workflow = [
  {
    title: "start with a thought",
    body: "create a note and start writing in markdown. the editor stays out of your way until you need it.",
  },
  {
    title: "enrich with resources",
    body: "append a youtube lecture or link a pdf. build a comprehensive study record in one place.",
  },
  {
    title: "lookup in flow",
    body: "highlight a term to search external sources. bring the answers back into your notes instantly.",
  },
  {
    title: "jump through time",
    body: "use dynamic timestamps to navigate complex video lectures alongside your own transcriptions.",
  },
];

function AuthPage({
  mode,
  onSurfaceChange,
}: {
  mode: Exclude<Surface, 'landing' | 'workspace'>
  onSurfaceChange: (surface: Surface) => void
}) {
  const copy = {
    login: { title: 'log in', body: 'continue into learn by Quing.' },
    signup: { title: 'sign up', body: 'create a focused study workspace.' },
    recovery: { title: 'recover access', body: 'request a reset link.' },
  }[mode]

  const { signIn } = useAuth();

  return (
    <AuthShell
      title={copy.title}
      subtitle={copy.body}
      onBack={() => onSurfaceChange('landing')}
      footer={
        <div className="flex flex-wrap gap-3">
          {mode !== 'login' && <button onClick={() => onSurfaceChange('login')} className="hover:text-[var(--color-end)] underline">log in</button>}
          {mode !== 'signup' && <button onClick={() => onSurfaceChange('signup')} className="hover:text-[var(--color-end)] underline">sign up</button>}
          {mode !== 'recovery' && <button onClick={() => onSurfaceChange('recovery')} className="hover:text-[var(--color-end)] underline">recovery</button>}
        </div>
      }
    >
      <div className="grid gap-4">
        <GoogleButton />
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--color-cornflower)]"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[var(--color-start)] px-2 text-[var(--color-ocean)]">or</span></div>
        </div>
        <PrimaryButton onClick={() => {
            void signIn()
          }}>
          {mode === 'recovery' ? 'go to recovery' : 'continue to secure login'}
        </PrimaryButton>
        <p className="text-[10px] text-ocean text-center italic">you will be redirected to our secure authentication provider.</p>
      </div>
    </AuthShell>
  )
}

function App() {
  const [surface, setSurface] = useState<Surface>('landing')
  const { isAuthenticated, isLoading } = useConvexAuth()

  function changeSurface(next: Surface) {
    if (next === 'workspace' && !isAuthenticated) {
      setSurface('login')
      return
    }
    startTransition(() => setSurface(next))
  }

  if (isLoading) {
    return (
      <div className="min-h-dvh grid place-items-center bg-start">
        <div className="animate-pulse text-ocean text-[10px] uppercase tracking-widest">authenticating...</div>
      </div>
    )
  }

  return (
    <>
      {isAuthenticated ? (
        <Workspace />
      ) : surface === 'landing' ? (
        <LandingPage onSurfaceChange={changeSurface} />
      ) : (
        <AuthPage mode={surface as any} onSurfaceChange={changeSurface} />
      )}
    </>
  )
}

export default App

