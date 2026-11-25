'use client';

import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BsArrowRight, BsLinkedin } from 'react-icons/bs';
import { HiDownload } from 'react-icons/hi';
import { useSectionInView } from '@/lib/hooks';
import { useActiveSectionContext } from '@/context/active-section-context';
import { useTranslations } from 'next-intl';


export default function Intro() {
  const { ref } = useSectionInView('Home', 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const t = useTranslations('intro');
  const site = useTranslations('site');
  // 사진·CV·LinkedIn은 messages의 site 항목 또는 구글 시트 Settings 탭에서 바꿈
  const PROFILE_PHOTO = site('photo');
  const LINKEDIN_URL = site('linkedin');
  const CV_FILE = site('cv');

  return (
    <section
      ref={ref}
      id="home"
      className="mb-28 w-full max-w-[52rem] sm:mb-0 scroll-mt-[100rem]"
    >
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-end sm:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'tween', duration: 0.5 }}
          className="group relative h-72 w-56 shrink-0 overflow-hidden rounded-2xl shadow-xl sm:h-80 sm:w-64"
        >
          <Image
            src={PROFILE_PHOTO}
            alt="Yui"
            fill
            sizes="(max-width: 640px) 224px, 256px"
            quality={95}
            priority
className="object-cover object-top transition duration-700 group-hover:scale-105 motion-reduce:transition-none"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'tween', duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center text-center sm:items-start sm:text-left sm:pb-2"
        >
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">{t('name')}</h1>
          <p className="mt-2 text-xl text-gray-700 dark:text-white/80">{t('role')}</p>
          <p className="mt-5 max-w-[26rem] text-[0.95rem] leading-7 text-gray-600 dark:text-white/65">
            {t('bio')}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <Link
              href="#contact"
              className="group flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-white outline-none transition hover:scale-105 focus:scale-105 active:scale-100 dark:bg-white dark:text-gray-950"
              onClick={() => {
                setActiveSection('Contact');
                setTimeOfLastClick(Date.now());
              }}
            >
              {t('contactButton')}
              <BsArrowRight className="opacity-70 transition group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <a
              href={CV_FILE}
              // 새 탭에서 PDF를 바로 열어 보여줌 (브라우저마다 '다운로드'가 조용히 막히거나 안 보이는 문제 방지)
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 outline-none transition hover:scale-105 focus:scale-105 active:scale-100 borderBlack dark:bg-white/10"
            >
              {t('downloadCvButton')}
              <HiDownload className="opacity-60 transition group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-700 outline-none transition hover:scale-110 hover:text-gray-950 focus:scale-110 borderBlack dark:bg-white/10 dark:text-white/70"
            >
              <BsLinkedin aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
