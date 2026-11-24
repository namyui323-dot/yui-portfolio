'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { BsChevronLeft, BsChevronRight, BsX } from 'react-icons/bs';

export type InlineImage = { src: string; caption?: string };

// 활동 상세 페이지 본문 중간에 들어가는 사진 묶음
// 1장 = 가로 꽉 차게, 2장 이상 = 2열(모바일 1열). 클릭하면 크게 보기
export default function InlineGallery({ images, title }: { images: InlineImage[]; title: string }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'ArrowRight') setActive((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === 'ArrowLeft') setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, images.length]);

  const single = images.length === 1;

  return (
    <>
      <div className={`mt-5 grid gap-4 ${single ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {images.map((img, i) => (
          <figure key={`${img.src}-${i}`} className="flex flex-col">
            <button
              type="button"
              onClick={() => setActive(i)}
              className={`relative w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-white/5 transition hover:opacity-90 ${single ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}
              aria-label={`Open image: ${img.caption || `${title} ${i + 1}`}`}
            >
              <Image
                src={img.src}
                alt={img.caption || `${title} — image ${i + 1}`}
                fill
                sizes={single ? '(max-width: 52rem) 100vw, 52rem' : '(max-width: 640px) 100vw, 26rem'}
                className="object-contain"
              />
            </button>
            {img.caption && <figcaption className="mt-2 text-sm text-gray-500 dark:text-white/50">{img.caption}</figcaption>}
          </figure>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              key={active}
              className="relative h-[80vh] w-full max-w-4xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[active].src} alt={images[active].caption || `${title} — image ${active + 1}`} fill sizes="100vw" className="object-contain" />
            </motion.div>
            {images[active].caption && (
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white">{images[active].caption}</p>
            )}
            <button type="button" aria-label="Close" onClick={() => setActive(null)} className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
              <BsX size={26} />
            </button>
            {images.length > 1 && (
              <>
                <button type="button" aria-label="Previous image" onClick={(e) => { e.stopPropagation(); setActive((active - 1 + images.length) % images.length); }} className="absolute left-4 h-11 w-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
                  <BsChevronLeft size={20} />
                </button>
                <button type="button" aria-label="Next image" onClick={(e) => { e.stopPropagation(); setActive((active + 1) % images.length); }} className="absolute right-4 h-11 w-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
                  <BsChevronRight size={20} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
