'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BsArrowRight } from 'react-icons/bs';
import SectionHeading from './section-heading';
import { activitiesData } from '@/lib/data';
import type { Activity } from '@/lib/sheet';
import { useSectionInView } from '@/lib/hooks';
import { useTranslations } from 'next-intl';

// 시트 featured 칸에 y를 적은 활동 = 사진이 들어간 큰 카드 (항상 맨 위)
// 나머지 = 한 줄 카드
export default function Activities({ items = activitiesData }: { items?: Activity[] }) {
  const { ref } = useSectionInView('Activities', 0.3);
  const h = useTranslations('headings');
  const featured = items.filter((i) => i.featured);
  const rest = items.filter((i) => !i.featured);

  return (
    <section id="activities" ref={ref} className="scroll-mt-28 mb-28 sm:mb-40 w-full max-w-[42rem]">
      <SectionHeading>{h('Activities')}</SectionHeading>

      {featured.length > 0 && (
        <div className="mb-3 flex flex-col gap-3">
          {featured.map((item) => (
            <motion.div key={item.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Link
                href={`/activities/${item.slug}`}
                className="group block overflow-hidden rounded-2xl bg-gray-100 transition hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {item.cover && (
                  <span className="relative block aspect-[2/1] w-full overflow-hidden bg-gray-200 dark:bg-white/5">
                    <Image
                      src={item.cover}
                      alt={item.title}
                      fill
                      sizes="(max-width: 42rem) 100vw, 42rem"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </span>
                )}
                <span className="flex items-end justify-between gap-4 px-6 py-5">
                  <span className="flex flex-col">
                    <span className="text-sm text-gray-500 dark:text-white/50">{item.date}</span>
                    <span className="mt-1 text-xl font-medium">{item.title}</span>
                    <span className="mt-2 text-sm text-gray-600 leading-relaxed dark:text-white/60">{item.summary}</span>
                  </span>
                  <BsArrowRight aria-hidden="true" className="shrink-0 mb-1 text-gray-500 transition group-hover:translate-x-1 dark:text-white/50" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {rest.map((item, index) => (
          <motion.li
            key={item.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 * index }}
          >
            <Link
              href={`/activities/${item.slug}`}
              className="group flex items-start justify-between gap-4 rounded-2xl bg-gray-100 px-6 py-5 transition hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <span className="flex flex-col">
                <span className="text-lg">{item.title}</span>
                <span className="mt-1 text-sm text-gray-600 leading-relaxed dark:text-white/60">{item.summary}</span>
              </span>
              <span className="flex items-center gap-3 shrink-0 text-sm text-gray-500 dark:text-white/50">
                {item.photos.length > 0 && <span>{item.photos.length} photos</span>}
                <BsArrowRight aria-hidden="true" className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
