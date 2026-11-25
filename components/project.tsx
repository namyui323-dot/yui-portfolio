'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { projectsData } from '@/lib/data';

type ProjectProps = (typeof projectsData)[number] & { index: number };

// 프로젝트 번호로 찾을 파일 확장자 (앞에서부터 차례로 시도)
const EXTS = ['mp4', 'webm', 'png', 'jpg', 'jpeg', 'webp', 'gif'];

// description 칸에 ## / - / > 로 구조를 쓰면 상세 화면에 섹션형으로 표시됨
const isStructured = (t?: string) => !!t && /^(##|-|>) /m.test(t);

// 카드에 보일 짧은 요약: 첫 섹션(##, -) 앞에 쓴 일반 문장만 사용 (성과 칩 줄은 순서와 상관없이 제외)
function summarize(text: string): string {
  const intro: string[] = [];
  for (const l of text.split(/\n/).map((x) => x.trim()).filter(Boolean)) {
    if (/^(##|-) /.test(l)) break;
    if (l.startsWith('> ') || l.startsWith('# ')) continue; // 성과 문구·성과 칩 줄은 요약에서 제외
    intro.push(l);
  }
  return intro.join(' ').replace(/\*\*/g, '');
}

// "# 한 줄" = 면접관이 가장 궁금한 '그래서 뭘 해냈나'를 숫자 위에 작게 보여주는 문구
function headlineOf(text: string): string {
  const l = text.split(/\n/).map((x) => x.trim()).find((x) => x.startsWith('# '));
  return l ? l.slice(2).replace(/\*\*/g, '') : '';
}

// 카드에 보일 핵심 성과: "> 키워드 | 값" 줄을 작은 칩으로
function metricsOf(text: string): { value: string; label: string }[] {
  return text
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith('> '))
    .map((l) => {
      const [label, ...rest] = l.slice(2).split('|');
      return rest.length ? { label: label.trim(), value: rest.join('|').trim() } : { label: '', value: label.trim() };
    });
}

// 문장 안의 **숫자·핵심어**를 형광펜처럼 강조
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
      <strong key={i} className="rounded bg-amber-200/70 px-1 font-semibold text-gray-900 dark:bg-amber-300/20 dark:text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

// 시트의 detail 칸 글을 섹션형으로 변환
//  ## 제목        → 번호가 붙은 섹션 (예: 맥락과 목표 / 판단과 실행 / 변화와 성과)
//  - 내용         → 목록 (문장 안 **강조** 가능)
//  > 키워드 | 값  → 큰 숫자 성과 카드 (예: > 시간 | 약 3일 → 하루)
//  ![설명](사진 주소) → 사진 (누르면 원본 크기로 새 탭에서 열림)
//  ### 소제목     → 섹션 안의 작은 제목 (예: 01. 제품 포트폴리오)
//  = 층 이름 | 장비1, 장비2 | 짧은 설명 → 피부층처럼 위에서 아래로 쌓이는 표 (줄 순서대로 표피·진피·피하 색)
//  그 외 줄       → 일반 문단
const IMG = /^!\[([^\]]*)\]\((\S+)\)$/;
function imgUrl(v: string): string {
  const m = v.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?.*id=)([\w-]+)/);
  return m ? `https://lh3.googleusercontent.com/d/${m[1]}` : v;
}
function renderDetail(text: string): ReactNode {
  type Section = { title?: string; nodes: ReactNode[] };
  const sections: Section[] = [{ nodes: [] }];
  let bullets: string[] = [];
  let metrics: { value: string; label: string }[] = [];
  let layers: { name: string; items: string[]; note: string }[] = [];
  const cur = () => sections[sections.length - 1];

  const flush = () => {
    const nodes = cur().nodes;
    if (bullets.length) {
      nodes.push(
        <ul key={`u${nodes.length}`} className="space-y-4">
          {bullets.map((b, i) => {
            const at = b.indexOf(' · ');
            const label = at > 0 ? b.slice(0, at) : '';
            const body = at > 0 ? b.slice(at + 3) : b;
            return (
              <li key={i} className="flex gap-3">
                <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400 dark:bg-white/40" />
                <div>
                  {label && <div className="font-medium text-gray-900 dark:text-white">{inline(label)}</div>}
                  <div>{inline(body)}</div>
                </div>
              </li>
            );
          })}
        </ul>,
      );
      bullets = [];
    }
    if (metrics.length) {
      nodes.push(
        <div key={`m${nodes.length}`} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {metrics.map((m, i) => (
            <div key={i} className="rounded-xl border border-black/10 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
              {m.label && <div className="text-sm font-medium text-gray-600 dark:text-white/70">{m.label}</div>}
              <div className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{m.value}</div>
            </div>
          ))}
        </div>,
      );
      metrics = [];
    }
    if (layers.length) {
      const tone = [
        'bg-amber-100 text-amber-900 dark:bg-amber-300/20 dark:text-amber-100',
        'bg-rose-200 text-rose-900 dark:bg-rose-400/25 dark:text-rose-100',
        'bg-yellow-200 text-yellow-900 dark:bg-yellow-500/20 dark:text-yellow-100',
        'bg-stone-200 text-stone-900 dark:bg-stone-400/20 dark:text-stone-100',
      ];
      nodes.push(
        <div key={`l${nodes.length}`} className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
          {layers.map((ly, i) => (
            <div key={i} className={`flex flex-col sm:flex-row ${i > 0 ? 'border-t border-black/10 dark:border-white/10' : ''}`}>
              <div className={`flex shrink-0 items-center px-4 py-3 text-sm font-semibold sm:w-36 ${tone[i % tone.length]}`}>{ly.name}</div>
              <div className="flex-1 px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {ly.items.map((it) => (
                    <span key={it} className="rounded-full bg-gray-900 px-3 py-1 text-sm font-medium leading-6 text-white dark:bg-white dark:text-gray-900">{it}</span>
                  ))}
                </div>
                {ly.note && <div className="mt-2 text-sm leading-6 text-gray-600 dark:text-white/65">{inline(ly.note)}</div>}
              </div>
            </div>
          ))}
        </div>,
      );
      layers = [];
    }
  };

  text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((l) => {
      const img = l.match(IMG);
      if (img) {
        flush();
        const url = imgUrl(img[2]);
        return void cur().nodes.push(
          <figure key={`f${cur().nodes.length}`} className="!mt-6">
            <a href={url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={img[1]} loading="lazy" className="w-full h-auto transition hover:opacity-90" />
            </a>
            {img[1] && <figcaption className="mt-2 text-sm text-gray-500 dark:text-white/50">{img[1]}</figcaption>}
          </figure>,
        );
      }
      if (l.startsWith('- ')) {
        if (metrics.length || layers.length) flush();
        return void bullets.push(l.slice(2));
      }
      if (l.startsWith('# ')) {
        flush();
        return void cur().nodes.push(
          <p key={`k${cur().nodes.length}`} className="!mb-[-0.5rem] text-sm font-medium leading-6 text-gray-500 dark:text-white/60">
            {inline(l.slice(2))}
          </p>,
        );
      }
      if (l.startsWith('### ')) {
        flush();
        return void cur().nodes.push(
          <h4 key={`h${cur().nodes.length}`} className="!mt-8 text-lg font-semibold text-gray-900 first:!mt-0 dark:text-white">
            {inline(l.slice(4))}
          </h4>,
        );
      }
      if (l.startsWith('= ')) {
        if (bullets.length || metrics.length) flush();
        const [name, items = '', ...note] = l.slice(2).split('|');
        return void layers.push({
          name: name.trim(),
          items: items.split(',').map((x) => x.trim()).filter(Boolean),
          note: note.join('|').trim(),
        });
      }
      if (l.startsWith('> ')) {
        if (bullets.length || layers.length) flush();
        const [label, ...rest] = l.slice(2).split('|');
        return void metrics.push(rest.length ? { label: label.trim(), value: rest.join('|').trim() } : { label: '', value: label.trim() });
      }
      flush();
      if (l.startsWith('## ')) sections.push({ title: l.slice(3), nodes: [] });
      else cur().nodes.push(<p key={`p${cur().nodes.length}`}>{inline(l)}</p>);
    });
  flush();

  let n = 0;
  return (
    <div className="space-y-10">
      {sections
        .filter((sec) => sec.title || sec.nodes.length)
        .map((sec, i) => (
          <section key={i} className={i > 0 ? 'border-t border-black/10 pt-8 dark:border-white/10' : ''}>
            {sec.title && (
              <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-white">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm text-white dark:bg-white dark:text-gray-900">
                  {++n}
                </span>
                {sec.title}
              </h3>
            )}
            <div className={`space-y-4 text-base leading-8 text-gray-700 dark:text-white/80 sm:text-[17px] ${sec.title ? 'mt-4 sm:pl-10' : ''}`}>{sec.nodes}</div>
          </section>
        ))}
    </div>
  );
}

const isVideoSrc = (v: string) => /\.(mp4|webm)(\?|$)/i.test(v);

// 카드를 클릭하면 뜨는 상세 화면: 영상은 위에 고정된 채 재생되고, 사진은 내용과 함께 스크롤됨
function ProjectModal({
  src, title, description, tags, detail, onClose, ko,
}: { src: string; title: string; description: string; tags: string[]; detail?: string; onClose: () => void; ko: boolean }) {
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

  const btn = 'absolute top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80';
  const icon = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-3xl flex-col overflow-hidden bg-white text-gray-900 shadow-2xl dark:bg-gray-900 dark:text-white/90 sm:h-auto sm:max-h-[92vh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideoSrc(src) ? (
        <div className="relative shrink-0 bg-black">
          <video
            ref={ref}
            src={src}
            autoPlay
            loop
            playsInline
            controls
            onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
            className="mx-auto max-h-[38vh] w-full object-contain sm:max-h-[50vh]"
          />
          <button type="button" onClick={toggleMute} aria-label={muted ? (ko ? '소리 켜기' : 'Unmute') : ko ? '음소거' : 'Mute'} className={`${btn} left-3`}>
            {muted ? (
              <svg {...icon}><path d="M11 5 6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
            ) : (
              <svg {...icon}><path d="M11 5 6 9H2v6h4l5 4V5z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M19 5a10 10 0 0 1 0 14" /></svg>
            )}
          </button>
          <button type="button" onClick={onClose} aria-label={ko ? '닫기' : 'Close'} className={`${btn} right-3`}>
            <svg {...icon}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        ) : (
        // 사진 카드: 닫기 버튼만 위에 떠 있고, 사진은 아래 내용과 함께 스크롤됨
        <div className="relative z-10 h-0 shrink-0">
          <button type="button" onClick={onClose} aria-label={ko ? '닫기' : 'Close'} className={`${btn} right-3`}>
            <svg {...icon}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        )}
        <div className="flex-1 overflow-y-auto overscroll-contain scroll-smooth">
        {!isVideoSrc(src) && (src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={title} className="block w-full h-auto bg-gray-100 dark:bg-black/40" />
        ) : (
          <div className="h-14" />
        ))}
        <div className="px-6 py-6 pb-12 sm:px-10 sm:py-8 sm:pb-14">
          <h2 className="text-2xl font-semibold leading-snug">{title}</h2>
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-white/10 dark:text-white/80">{t}</span>
              ))}
            </div>
          )}
          {description && <p className="mt-4 text-lg leading-8 text-gray-700 dark:text-white/80">{description}</p>}
          {detail && <div className={description ? 'mt-8 border-t border-black/10 pt-8 dark:border-white/10' : 'mt-6'}>{renderDetail(detail)}</div>}
        </div>
        </div>
      </div>
    </div>
  );
}

export default function Project({ id, translations, tags, imageUrl, imageLink, index }: ProjectProps) {
  const locale = useLocale() as 'en' | 'ko';
  const { title, description: rawDescription, detail: rawDetail } = translations[locale];
  // 구조가 적힌 description은 카드에는 요약만, 상세 화면에는 전체를 섹션형으로 보여줌
  const structured = isStructured(rawDescription);
  const description = structured ? summarize(rawDescription) : rawDescription;
  const detail = rawDetail || (structured ? rawDescription : undefined);
  const chips = structured ? metricsOf(rawDescription) : [];
  const headline = structured ? headlineOf(rawDescription) : '';
  // 미리보기 후보: 시트 image 칸이 있으면 그것, 없으면 public/projects/<번호>.mp4·.png·.jpg … 순서로 찾음
  const candidates = useMemo(() => {
    if (imageUrl) return [imageUrl];
    // 영어 화면이면 <번호>.en.png 같은 영어용 파일을 먼저 찾고, 없으면 기본 파일 사용
    if (id) return [
      ...(locale === 'en' ? EXTS.map((ext) => `/projects/${id}.en.${ext}`) : []),
      ...EXTS.map((ext) => `/projects/${id}.${ext}`),
    ];
    return [];
  }, [imageUrl, id, locale]);
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
  // 영상·태그 카드는 16:9 비율로 잘림 없이 보여주고, 정지 이미지 카드만 기존 높이(스크롤 효과) 유지
  // 영상이 있거나 상세 내용(detail)이 있으면 카드를 눌러 상세 화면을 엶
  const clickable = isVideo || !!detail;
  // 상세 화면이 있는 카드의 이미지는 영상 카드와 똑같이 16:9 틀에 통째로 보여줌
  const fitImage = !!current && !isVideo && clickable;
  const isStaticImage = !!current && !isVideo && !fitImage;
  const openModal = () => setOpen(true);
  const expandIcon = (
    <span className="pointer-events-none absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white opacity-80 transition group-hover:opacity-100">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
    </span>
  );

  const card = (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: 0.06 * (index % 2) }}
      whileHover={{ y: -6 }}
      className={`group h-full flex flex-col ${clickable ? 'cursor-pointer' : ''}`}
      {...(clickable
        ? {
            role: 'button',
            tabIndex: 0,
            'aria-label': title,
            onClick: openModal,
            onKeyDown: (e: ReactKeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && openModal(),
          }
        : {})}
    >
      {/* 미리보기: 이미지가 있으면 마우스를 올렸을 때 천천히 아래로 스크롤, 없으면 태그가 흐르는 띠 */}
      <div
        className={`relative ${isStaticImage ? 'h-44 sm:h-48' : 'aspect-video'} overflow-hidden rounded-2xl border border-black/10 bg-gray-100 dark:bg-white/5 dark:border-white/10 `}
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
            className="absolute inset-0 h-full w-full object-contain"
          />
          {expandIcon}
          </>
        ) : fitImage ? (
          <>
          <Image
            key={src || 'fit'}
            src={current}
            {...(typeof current === 'string' ? { width: 1600, height: 900, sizes: '(max-width: 640px) 100vw, 420px' } : {})}
            unoptimized={isGif}
            onError={tryNext}
            alt={title}
            quality={90}
            className="absolute inset-0 h-full w-full object-contain"
          />
          {expandIcon}
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
      {description && (
        <p
          className="mt-1 text-gray-600 leading-relaxed dark:text-white/70"
          style={structured ? { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : undefined}
        >
          {description}
        </p>
      )}
      {chips.length > 0 && (
        <p className="mt-3 text-xs font-medium text-gray-500 dark:text-white/60">{headline || (locale === 'ko' ? '핵심 성과' : 'Key results')}</p>
      )}
      {chips.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-2">
          {chips.map((c, i) => (
            <span key={i} className="rounded-lg bg-gray-100 px-2.5 py-1 text-sm dark:bg-white/10">
              {c.label && <span className="mr-1.5 text-gray-600 dark:text-white/70">{c.label}</span>}
              <b className="font-semibold text-gray-900 dark:text-white">{c.value}</b>
            </span>
          ))}
        </div>
      )}
    </motion.article>
  );

  const modal =
    open && clickable && mounted
      ? createPortal(
          <ProjectModal src={src} title={title} description={structured && !rawDetail ? '' : description} tags={tags} detail={detail} ko={locale === 'ko'} onClose={() => setOpen(false)} />,
          document.body,
        )
      : null;

  // 영상 카드는 클릭 시 큰 화면이 뜨므로 링크로 감싸지 않음
  if (imageLink && !clickable) {
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
