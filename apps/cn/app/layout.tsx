import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '天时历 · 老黄历查询与传统择日',
    template: '%s · 天时历',
  },
  description:
    '每日老黄历宜忌、冲煞、值神与建除十二值星查询，传统择日文化工具。内容源自《协纪辨方书》等传统民俗文献，仅供传统文化学习参考。',
};

const NAV = [
  { href: '/', label: '今日黄历' },
  { href: '/zeri', label: '传统择日' },
  { href: '/qiming', label: '宝宝起名' },
  { href: '/ceming', label: '姓名文化' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-stone-100 text-stone-800 antialiased">
        <header className="border-b border-stone-300 bg-stone-50">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-semibold tracking-widest text-stone-900">
              天时历
            </Link>
            <nav className="flex gap-6 text-sm">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="text-stone-600 hover:text-stone-900">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        <footer className="border-t border-stone-300 bg-stone-50">
          <div className="mx-auto max-w-4xl px-4 py-6 text-xs leading-relaxed text-stone-500">
            <p>
              本站内容整理自《协纪辨方书》等传统民俗文献，属传统文化知识展示，仅供文化学习与参考，
              不构成任何现实决策建议。
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
