import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AURELO · Chinese Four Pillars (BaZi) Birth Chart',
    template: '%s · AURELO',
  },
  description:
    'Your Chinese astrology birth chart, computed precisely from 1,000-year-old Four Pillars (BaZi) methodology. Free chart, five elements analysis, and compatibility.',
};

const NAV = [
  { href: '/', label: 'Birth Chart' },
  { href: '/compatibility', label: 'Compatibility' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-950 text-stone-200 antialiased">
        <header className="border-b border-stone-800">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5">
            <Link href="/" className="text-lg font-semibold tracking-[0.3em] text-stone-100">
              AURELO
            </Link>
            <nav className="flex gap-6 text-sm">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="text-stone-400 transition hover:text-stone-100">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-10">{children}</main>
        <footer className="border-t border-stone-800">
          <div className="mx-auto max-w-4xl px-4 py-6 text-xs leading-relaxed text-stone-500">
            <p>
              AURELO presents traditional Four Pillars (BaZi) methodology for reflection and entertainment.
              It is not medical, legal, or financial advice.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
