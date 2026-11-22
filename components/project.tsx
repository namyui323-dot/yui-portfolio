'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { projectsData } from '@/lib/data';

type ProjectProps = (typeof projectsData)[number] & { index: number };

// 프로젝트 번호로 찾을 파일 확장자 (앞에서부터 차례로 시도)
const EXTS = ['mp4', 'webm', 'png', 'jpg', 'jpeg', 'webp', 'gif'];

// 영상을 클릭하면 뜨는 큰 화면: 소리가 켜진 채 재생되고, 음소거 버튼·닫기 버튼이 있음
function VideoModal({ src, title, onClose, ko }: { src: string; title: string; onClose: () => void; ko: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const toggleMute = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const btn =
    'flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80';

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <video
          ref={ref}
          src={src}
          autoPlay
          loop
          playsInline
          controls
          onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
          className="max-h-[85vh] w-full rounded-xl bg-black"
        />
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? (ko ? '소리 켜기' : 'Unmute') : ko ? '음소거' : 'Mute'}
          className={`${btn} absolute left-3 top-3`}
        >
          {muted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M19 5a10 10 0 0 1 0 14" /></svg>
          )}
        </button>
        <button type="button" onClick={onClose} aria-label={ko ? '닫기' : 'Close'} className={`${btn} absolute right-3 top-3`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
    </div>
  );
}

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
  const [open, setOpen] = useState(false);
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
      <div
        className={`relative h-44 sm:h-48 overflow-hidden rounded-2xl border border-black/10 bg-gray-100 dark:bg-white/5 dark:border-white/10 ${isVideo ? 'cursor-pointer' : ''}`}
        {...(isVideo
          ? {
              role: 'button',
              tabIndex: 0,
              'aria-label': title,
              onClick: () => setOpen(true),
              onKeyDown: (e: ReactKeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && setOpen(true),
            }
          : {})}
      >
        {waiting ? null : isVideo ? (
          // 움직이는 미리보기: 짧은 화면 녹화 영상(.mp4/.webm)을 소리 없이 반복 재생
          <>
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
          <span className="pointer-events-none absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white opacity-80 transition group-hover:opacity-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
          </span>
          </>
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

  const modal =
    open && isVideo && mounted
      ? createPortal(<VideoModal src={src} title={title} ko={locale === 'ko'} onClose={() => setOpen(false)} />, document.body)
      : null;

  // 영상 카드는 클릭 시 큰 화면이 뜨므로 링크로 감싸지 않음
  if (imageLink && !isVideo) {
    return (
      <a href={imageLink} target="_blank" rel="noreferrer" className="block h-full">
        {card}
      </a>
    );
  }
  return (
    <>
      {card}
      {modal}
    </>
  );
}
