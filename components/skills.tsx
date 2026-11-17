'use client';

import React from 'react';
import SectionHeading from './section-heading';
import { skillsData } from '@/lib/data';
import type { Skill } from '@/lib/sheet';
import { ICONS } from '@/lib/icons';
import { useSectionInView } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 60 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.04 * index },
  }),
};

export default function Skills({ items = skillsData }: { items?: Skill[] }) {
  const { ref } = useSectionInView('Skills');
  const h = useTranslations('headings');

  return (
    <section id="skills" ref={ref} className="mb-28 max-w-[53rem] scroll-mt-28 text-center sm:mb-40">
      <SectionHeading>{h('Skills')}</SectionHeading>
      <ul className="flex flex-wrap justify-center gap-2.5">
        {items.map((skill, index) => {
          const found = skill.icon ? ICONS[skill.icon] : undefined;
          const Icon = found?.icon;
          const color = skill.color || found?.color;
          return (
            <motion.li
              key={skill.name}
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              custom={index}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-[0.95rem] text-gray-800 shadow-sm cursor-default transition-colors duration-200 hover:bg-gray-100 dark:bg-white/5 dark:border-white/10 dark:text-white/85 dark:hover:bg-white/15"
            >
              {Icon && <Icon aria-hidden="true" className="shrink-0 text-lg" style={color ? { color } : undefined} />}
              {skill.badge && (
                <span aria-hidden="true" className="shrink-0 rounded-[0.3rem] border-[1.5px] border-current px-1 text-[0.6rem] font-bold leading-[1.1rem]">
                  {skill.badge}
                </span>
              )}
              <span>{skill.name}</span>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
