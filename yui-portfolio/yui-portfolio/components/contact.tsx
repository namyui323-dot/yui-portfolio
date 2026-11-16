'use client';

import React from 'react';
import SectionHeading from './section-heading';
import { motion } from 'framer-motion';
import { useSectionInView } from '@/lib/hooks';
import { useTranslations } from 'next-intl';

export default function Contact() {
  const { ref } = useSectionInView('Contact');
  const t = useTranslations('contact');

  return (
    <motion.section
      id="contact"
      ref={ref}
      className="mb-20 sm:mb-28 w-[min(100%,38rem)] text-center"
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
      }}
      viewport={{
        once: true,
      }}
    >
      <SectionHeading>{t('Header')}</SectionHeading>
      <p className="text-gray-700 -mt-6 dark:text-white/80">
        {t('Please')}{' '}
        {/* ✏️ 개인 이메일로 바꾸세요 */}
        <a className="underline" href="mailto:namyui323@gmail.com">
          namyui323@gmail.com
        </a>{' '}
      </p>
    </motion.section>
  );
}
