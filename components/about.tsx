'use client';

import React from 'react';
import SectionHeading from './section-heading';
import { motion } from 'framer-motion';
import { useSectionInView } from '@/lib/hooks';
import { useTranslations } from 'next-intl';

// 문구 안의 <b>굵게</b>, <i>기울임</i>, <u>밑줄</u> 표시
const rich = {
  b: (chunks: React.ReactNode) => <span className="font-semibold">{chunks}</span>,
  i: (chunks: React.ReactNode) => <span className="italic">{chunks}</span>,
  u: (chunks: React.ReactNode) => <span className="underline">{chunks}</span>,
};

export default function About() {
  const { ref } = useSectionInView('About');
  const t = useTranslations('about');
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

      <p>{t.rich('paragraph1', rich)}</p>

      <p>{t.rich('paragraph2', rich)}</p>
    </motion.section>
  );
}
