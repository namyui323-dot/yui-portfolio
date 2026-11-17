'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { projectsData } from '@/lib/data';

type ProjectProps = (typeof projectsData)[number] & { index: number };

export default function Project({ translations, tags, imageUrl, imageLink, index }: ProjectProps) {
  const locale = useLocale() as 'en' | 'ko';
  const { title, description } = translations[locale];

  const card = (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: 0.06 * (index % 2) }}
      whileHover={{ y: -6 }}
      className="group h-full flex flex-col"
    >
      {/* 미리보기: 이미지가 있으면 마우스를 올렸을 때 천천히 아래로 스크롤, 없으면 태그가 흐르는 띠 */}
      <div className="relative h-44 sm:h-48 overflow-hidden rounded-2xl border border-black/10 bg-gray-100 dark:bg-white/5 dark:border-white/10">
        {imageUrl ? (
          <Image
            src={imageUrl}
            {...(typeof imageUrl === 'string' ? { width: 1200, height: 800, sizes: '(max-width: 640px) 100vw, 420px' } : {})}
            alt={title}
            quality={90}
            className="w-full h-auto object-cover object-top transition-transform duration-[4000ms] ease-in-out group-hover:-translate-y-[calc(100%-12rem)] motion-reduce:transition-none"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-center gap-3 overflow-hidden">
            {[0, 1].map((row) => (
              <div
                key={row}
                className={`flex w-max gap-3 animate-marquee motion-reduce:animate-none ${row === 1 ? '[animation-direction:reverse]' : ''}`}
              >
                {[...tags, ...tags, ...tags, ...tags].map((tag, i) => (
                  <span
                    key={`${row}-${i}`}
                    className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm text-gray-700 shadow-sm dark:bg-white/10 dark:text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <h3 className="mt-3 text-lg font-medium group-hover:underline underline-offset-4">{title}</h3>
      <p className="mt-1 text-gray-600 leading-relaxed dark:text-white/70">{description}</p>
    </motion.article>
  );

  return imageLink ? (
    <a href={imageLink} target="_blank" rel="noreferrer" className="block h-full">
      {card}
    </a>
  ) : (
    card
  );
}
