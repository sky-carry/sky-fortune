import type { ReactNode } from 'react';

/** 极简 markdown 渲染（仅 ##/### 标题、段落、**加粗**、- 列表），避免为报告页引第三方依赖 */
export function renderMarkdown(md: string): ReactNode[] {
  const blocks = md.split(/\n{2,}/);
  return blocks.map((block, i) => {
    const b = block.trim();
    if (!b) return null;
    if (b.startsWith('### ')) {
      return <h3 key={i} className="mt-8 text-lg text-stone-100">{inline(b.slice(4))}</h3>;
    }
    if (b.startsWith('## ')) {
      return <h2 key={i} className="mt-10 text-xl text-stone-50">{inline(b.slice(3))}</h2>;
    }
    if (/^[-*] /m.test(b)) {
      const items = b.split('\n').filter((l) => /^[-*] /.test(l.trim()));
      return (
        <ul key={i} className="mt-4 list-disc space-y-2 pl-5 text-stone-300">
          {items.map((l, j) => <li key={j}>{inline(l.trim().slice(2))}</li>)}
        </ul>
      );
    }
    return <p key={i} className="mt-4 leading-relaxed text-stone-300">{inline(b)}</p>;
  });
}

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="text-stone-100">{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>,
  );
}
