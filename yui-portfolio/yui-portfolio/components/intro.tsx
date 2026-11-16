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

// ✏️ 프로필 사진: public/ 폴더에 profile.jpg를 넣고 아래를 '/profile.jpg'로 바꾸세요.
const PROFILE_PHOTO = '/profile.jpg';
// ✏️ 본인 링크로 바꾸세요.
const LINKEDIN_URL = 'https://www.linkedin.com/in/yuinam/';
// ✏️ 이력서 PDF를 public/ 폴더에 CV_Yui.pdf로 넣으세요.
const CV_FILE = '/CV_Yui.pdf';

export default function Intro() {
  const { ref } = useSectionInView('Home', 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const t = useTranslations('intro');

  return (
    <section
      ref={ref}
      className="mb-28 max-w-[50rem] text-center sm:mb-0 scroll-mt-[100rem]"
      id="home"
    >
      <div className="flex items-center justify-center">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'tween',
              duration: 0.2,
            }}
          >
            {PROFILE_PHOTO ? (
              <Image
                src={PROFILE_PHOTO}
                alt="Yui profile photo"
                width="192"
                height="192"
                quality={95}
                priority={true}
                className="h-36 w-36 rounded-full object-cover border-[0.25rem] border-white shadow-xl"
              />
            ) : (
              <div className="h-36 w-36 rounded-full border-[0.25rem] border-white shadow-xl bg-gray-900 text-white flex items-center justify-center text-5xl font-semibold dark:bg-white/10">
                Y
              </div>
            )}
          </motion.div>

          <motion.span
            className="text-4xl absolute bottom-0 right-8"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 125,
              delay: 0.1,
              duration: 0.7,
            }}
          >
            👋
          </motion.span>
        </div>
      </div>

      <motion.h1
        className="mb-10 mt-4 px-4 text-2xl font-medium leading-[1.5] sm:text-4xl"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t.rich('line1', {
          bold: (chunks) => <span className="font-bold">{chunks}</span>,
        })}{' '}
        {t.rich('line2', {
          italic: (chunks) => <span className="italic">{chunks}</span>,
        })}{' '}
        {t.rich('line3', {
          underline: (chunks) => <span className="underline">{chunks}</span>,
          br: () => <br />,
        })}
      </motion.h1>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-2 px-4 text-lg font-medium"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link
          href="#contact"
          className="group bg-gray-900 text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition"
          onClick={() => {
            setActiveSection('Contact');
            setTimeOfLastClick(Date.now());
          }}
        >
          {t('contactButton')}{' '}
          <BsArrowRight className="opacity-70 group-hover:translate-x-1 transition" />
        </Link>
        <a
          className="group bg-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10"
          href={CV_FILE}
          download
        >
          {t('downloadCvButton')}{' '}
          <HiDownload className="opacity-60 group-hover:translate-y-1 transition border-none" />
        </a>

        <a
          className="bg-white p-4 text-gray-700 flex items-center gap-2 rounded-full outline-none focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
          href={LINKEDIN_URL}
          aria-label="LinkedIn"
          target="_blank"
        >
          <BsLinkedin className="border-none"/>
        </a>

      </motion.div>
    </section>
  );
}
