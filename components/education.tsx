'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './section-heading';
import { educationData } from '@/lib/data';
import type { Education as EducationItem } from '@/lib/sheet';
import { useSectionInView } from '@/lib/hooks';
import { useTranslations } from 'next-intl';

export default function Education({ items = educationData }: { items?: EducationItem[] }) {
  const { ref } = useSectionInView('Education', 0.5);
  const h = useTranslations('headings');

  return (
    <section id="education" ref={ref} className="scroll-mt-28 mb-28 sm:mb-40 w-full max-w-[42rem]">
      <SectionHeading>{h('Education')}</SectionHeading>
      <ul className="flex flex-col gap-3">
        {items.map((item, index) => (
          <motion.li
            key={item.school}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 * index }}
            className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 rounded-2xl border border-black/10 bg-white/70 px-5 py-4 dark:bg-white/5 dark:border-white/10"
          >
            <div className="flex flex-col">
              <span className="font-medium">{item.degree}</span>
              <span className="text-gray-500 dark:text-white/60">{item.school}</span>
              {item.note && <span className="mt-1 text-sm text-gray-600 dark:text-white/60">{item.note}</span>}
            </div>
            <div className="flex flex-col sm:items-end text-sm text-gray-600 dark:text-white/60 shrink-0">
              <span>{item.date}</span>
              <span>{item.location}</span>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
