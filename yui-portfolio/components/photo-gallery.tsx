'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { BsChevronLeft, BsChevronRight, BsX } from 'react-icons/bs';

export default function PhotoGallery({ photos, title }: { photos: string[]; title: string }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'ArrowRight') setActive((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === 'ArrowLeft') setActive((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, photos.length]);

  if (photos.length === 0) {
    return <p className="mt-10 text-gray-500 dark:text-white/50">Photos coming soon.</p>;
  }

  return (
    <>
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {photos.map((src, i) => (
          <motion.button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i }}
            whileHover={{ scale: 1.03 }}
            className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-white/5"
            aria-label={`Open photo ${i + 1} of ${photos.length}`}
          >
            <Image src={src} alt={`${title} — photo ${i + 1}`} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover" />
          </motion.button>
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
              <Image src={photos[active]} alt={`${title} — photo ${active + 1}`} fill sizes="100vw" className="object-contain" />
            </motion.div>
            <button type="button" aria-label="Close" onClick={() => setActive(null)} className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
              <BsX size={26} />
            </button>
            {photos.length > 1 && (
              <>
                <button type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); setActive((active - 1 + photos.length) % photos.length); }} className="absolute left-4 h-11 w-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
                  <BsChevronLeft size={20} />
                </button>
                <button type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); setActive((active + 1) % photos.length); }} className="absolute right-4 h-11 w-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
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
