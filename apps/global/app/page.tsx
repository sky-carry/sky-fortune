import { BirthFields } from '@/components/BirthForm';

export default function LandingPage() {
  return (
    <div className="space-y-14">
      <section className="pt-8 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-stone-500">Four Pillars of Destiny · 八字</p>
        <h1 className="mx-auto mt-4 max-w-2xl text-4xl leading-tight text-stone-50 sm:text-5xl">
          The birth chart China has trusted for a thousand years.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-stone-400">
          BaZi maps the exact moment you were born into four pillars of time —
          revealing your elemental makeup, natural strengths, and the decade cycles ahead.
          No sun signs. No vague platitudes. Just the math, then the meaning.
        </p>
      </section>

      <section className="mx-auto max-w-xl rounded-lg border border-stone-800 bg-stone-900/50 p-6">
        <h2 className="text-lg text-stone-100">Cast your chart — free</h2>
        <form method="get" action="/bazi" className="mt-5 space-y-5">
          <BirthFields />
          <button
            type="submit"
            className="w-full rounded bg-stone-100 px-6 py-3 text-sm font-semibold tracking-wide text-stone-950 transition hover:bg-white"
          >
            Reveal my Four Pillars
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-stone-600">
          Charts are computed instantly. Nothing is stored.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        <Feature
          title="Precise by design"
          body="Solar-term boundaries to the minute, not calendar approximations. The same rules a classical master would use."
        />
        <Feature
          title="Five elements, decoded"
          body="See your elemental balance and which elements feed you — the basis of every BaZi recommendation."
        />
        <Feature
          title="Decade luck cycles"
          body="Your chart is the map; the luck pillars are the weather. Know which decade you are actually in."
        />
      </section>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-stone-800 p-5">
      <h3 className="text-stone-100">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-400">{body}</p>
    </div>
  );
}
