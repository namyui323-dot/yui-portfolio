'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { projectsData } from '@/lib/data';

type ProjectProps = (typeof projectsData)[number] & { index: number };

// 프로젝트 번호로 찾을 파일 확장자 (앞에서부터 차례로 시도)
const EXTS = ['mp4', 'webm', 'png', 'jpg', 'jpeg', 'webp', 'gif'];

export default function Project({ id, translations, tags, imageUrl, imageLink, index }: ProjectProps) {
  const locale = useLocale() as 'en' | 'ko';
  const { title, description } = translations[locale];
  // 미리보기 후보: 시트 image 칸이 있으면 그것, 없으면 public/projects/<번호>.mp4·.png·.jpg … 순서로 찾음
  const candidates = useMemo(() => {
    if (imageUrl) return [imageUrl];
    if (id) return EXTS.map((ext) => `/projects/${id}.${ext}`);
    return [];
  }, [imageUrl, id]);
  const [tryIndex, setTryIndex] = useState(0);
  // 화면이 준비된 뒤에 파일을 찾아야 '없는 파일'을 제대로 감지할 수 있음
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const waiting = !mounted && candidates.length > 0;
  const current = mounted ? candidates[tryIndex] : undefined;
  const tryNext = () => setTryIndex((i) => i + 1);
  const src = typeof current === 'string' ? current : '';
  const isVideo = /\.(mp4|webm)(\?|$)/i.test(src);
  const isGif = /\.gif(\?|$)/i.test(src);

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
        {waiting ? null : isVideo ? (
          // 움직이는 미리보기: 짧은 화면 녹화 영상(.mp4/.webm)을 소리 없이 반복 재생
          <video
            key={src}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={tryNext}
            aria-label={title}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        ) : current ? (
          <Image
            key={src || 'static'}
            src={current}
            {...(typeof current === 'string' ? { width: 1200, height: 800, sizes: '(max-width: 640px) 100vw, 420px' } : {})}
            unoptimized={isGif}
            onError={tryNext}
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
