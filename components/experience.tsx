'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BsArrowUpRight, BsChevronDown } from 'react-icons/bs';
import SectionHeading from './section-heading';
import { experiencesData } from '@/lib/data';
import type { Experience as ExperienceItem } from '@/lib/sheet';
import { useSectionInView } from '@/lib/hooks';
import { useTranslations } from 'next-intl';

export default function Experience({ items = experiencesData }: { items?: ExperienceItem[] }) {
  const { ref } = useSectionInView('Experience', 0.3);
  const h = useTranslations('headings');
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="experience" ref={ref} className="scroll-mt-28 mb-28 sm:mb-40 w-full max-w-[42rem]">
      <SectionHeading>{h('Experience')}</SectionHeading>
      <ul className="flex flex-col gap-4">
        {items.map((item, index) => {
          const isOpen = open === index;
          return (
            <motion.li
              key={item.company}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * index }}
              className="rounded-2xl border border-black/10 bg-white/70 dark:bg-white/5 dark:border-white/10 overflow-hidden"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : index)}
                className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left hover:bg-gray-100 dark:hover:bg-white/10 transition"
              >
                <span className="flex flex-col">
                  <span className="font-semibold">{item.role}</span>
                  <span className="text-gray-500 dark:text-white/60">{item.company}</span>
                </span>
                <span className="flex items-start gap-3 shrink-0">
                  <span className="flex flex-col items-end text-sm text-gray-600 dark:text-white/60">
                    <span>{item.date}</span>
                    <span>{item.location}</span>
                  </span>
                  <BsChevronDown
                    aria-hidden="true"
                    className={`mt-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-black/5 dark:border-white/10 text-gray-700 dark:text-white/75 leading-relaxed">
                      <p className="mt-3">{item.summary}</p>
                      <ul className="mt-3 flex flex-col gap-2 list-disc pl-5">
                        {item.points.map((pt) => (
                          <li key={pt}>{pt}</li>
                        ))}
                      </ul>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="group mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                        >
                          {h('VisitCompany')}
                          <BsArrowUpRight className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
