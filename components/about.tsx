'use client';

import React from 'react';
import SectionHeading from './section-heading';
import { motion } from 'framer-motion';
import { useSectionInView } from '@/lib/hooks';
import { useTranslations } from 'next-intl';

// 문구 안의 <b>굵게</b>, <i>기울임</i>, <u>밑줄</u> 표시
const STYLE: Record<string, string> = { b: 'font-semibold', i: 'italic', u: 'underline' };
function rich(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /<(b|i|u)>([\s\S]*?)<\/\1>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <span key={m.index} className={STYLE[m[1]]}>
        {rich(m[2])}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// 시트 Settings 탭 about.paragraph1 ~ about.paragraph8
// 한 칸 안에서 줄을 바꾸면(Ctrl+Enter / Alt+Enter) 그 줄마다 문단이 나뉨
const KEYS = ['paragraph1', 'paragraph2', 'paragraph3', 'paragraph4', 'paragraph5', 'paragraph6', 'paragraph7', 'paragraph8'] as const;

export default function About() {
  const { ref } = useSectionInView('About');
  const t = useTranslations('about');
  const paragraphs = KEYS.filter((k) => t.has(k))
    .flatMap((k) => String(t.raw(k)).split(/\n+/))
    .map((s) => s.trim().replace(/^"|"$/g, '').trim())
    .filter(Boolean);

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>{t('title')}</SectionHeading>
      <div className="flex flex-col gap-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="[word-break:keep-all] [text-wrap:pretty]">
            {rich(p)}
          </p>
        ))}
      </div>
    </motion.section>
  );
}
