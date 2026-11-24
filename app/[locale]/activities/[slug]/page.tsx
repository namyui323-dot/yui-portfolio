import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BsArrowLeft, BsChevronDown } from 'react-icons/bs';
import { getActivities, toImageUrl } from '@/lib/sheet';
import { getLocale, getTranslations } from 'next-intl/server';
import PhotoGallery from '@/components/photo-gallery';
import InlineGallery, { type InlineImage } from '@/components/inline-gallery';
import RouteMap from '@/components/route-map';

export const revalidate = 60;

// ───────── 시트 description 칸 쓰는 법 ─────────
//   ## 소제목              → 소제목 (항상 보임)
//   ### 항목 이름           → 클릭하면 아래로 펼쳐지는 항목. 다음 ### 이나 ## 전까지의 내용이 안에 들어감
//   - 내용                 → 목록
//   ![설명](사진 링크)      → 사진 (연달아 쓰면 2열)
//   [지도] 토리노 > 파르마 > ...  → 이동 경로 지도 (괄호 메모 가능: 볼로냐 (FICO, Ragù))
const IMG_MD = /^!\[([^\]]*)\]\((\S+)\)$/;
const IMG_URL = /^(https?:\/\/\S+|\/\S+\.(?:jpe?g|png|gif|webp|avif))$/i;
const MAP = /^\[(?:지도|map)\]\s*(.+)$/i;

function parseImage(line: string): InlineImage | null {
  const m = line.match(IMG_MD);
  if (m) return { src: toImageUrl(m[2]), caption: m[1].trim() || undefined };
  if (IMG_URL.test(line)) return { src: toImageUrl(line) };
  return null;
}

// 일반 줄들(목록·문단·사진·지도)을 화면 요소로
function renderLines(lines: string[], title: string, locale: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  let items: string[] = [];
  let images: InlineImage[] = [];
  const k = () => `${keyBase}-${out.length}`;
  const flushList = () => {
    if (!items.length) return;
    out.push(
      <ul key={k()} className="mt-3 list-disc space-y-2 pl-5">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>,
    );
    items = [];
  };
  const flushImages = () => {
    if (!images.length) return;
    out.push(<InlineGallery key={k()} images={images} title={title} />);
    images = [];
  };
  for (const line of lines) {
    const img = parseImage(line);
    if (img) {
      flushList();
      images.push(img);
      continue;
    }
    flushImages();
    const map = line.match(MAP);
    if (map) {
      flushList();
      out.push(<RouteMap key={k()} spec={map[1]} locale={locale} />);
    } else if (line.startsWith('- ')) {
      items.push(line.slice(2));
    } else {
      flushList();
      out.push(
        <p key={k()} className="mt-3">
          {line}
        </p>,
      );
    }
  }
  flushList();
  flushImages();
  return out;
}

function Description({ text, title, locale }: { text: string; title: string; locale: string }) {
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const out: ReactNode[] = [];
  let plain: string[] = [];
  let section: { title: string; lines: string[] } | null = null;

  const flushPlain = () => {
    if (plain.length) out.push(...renderLines(plain, title, locale, `p${out.length}`));
    plain = [];
  };
  const flushSection = () => {
    if (!section) return;
    const s = section;
    out.push(
      <details key={`d${out.length}`} className="group mt-3 rounded-2xl bg-gray-100 dark:bg-white/5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-gray-900 dark:text-white/90 [&::-webkit-details-marker]:hidden">
          <span className="font-medium">{s.title}</span>
          <BsChevronDown aria-hidden="true" className="shrink-0 transition group-open:rotate-180" />
        </summary>
        <div className="px-5 pb-5 -mt-1">{renderLines(s.lines, title, locale, `s${out.length}`)}</div>
      </details>,
    );
    section = null;
  };

  for (const line of lines) {
    if (line.startsWith('### ')) {
      flushPlain();
      flushSection();
      section = { title: line.slice(4), lines: [] };
    } else if (line.startsWith('## ')) {
      flushPlain();
      flushSection();
      out.push(
        <h2 key={`h${out.length}`} className="mt-10 text-xl font-semibold text-gray-900 dark:text-white/90">
          {line.slice(3)}
        </h2>,
      );
    } else if (section) {
      section.lines.push(line);
    } else {
      plain.push(line);
    }
  }
  flushPlain();
  flushSection();
  return <div className="mt-4 text-lg text-gray-600 leading-relaxed dark:text-white/70">{out}</div>;
}

export default async function ActivityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const activity = (await getActivities(locale)).find((a) => a.slug === slug);
  if (!activity) notFound();
  const h = await getTranslations('headings');
  const rich = activity.description.split(/\n/).some((l) => {
    const t = l.trim();
    return parseImage(t) || MAP.test(t) || t.startsWith('### ');
  });

  return (
    <main className="mx-auto w-full max-w-[52rem] px-4 mb-28">
      <Link href="/#activities" className="group inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-950 dark:text-white/60 dark:hover:text-white">
        <BsArrowLeft aria-hidden="true" className="transition group-hover:-translate-x-1" />
        {h('BackToActivities')}
      </Link>
      <h1 className="mt-6 text-3xl sm:text-5xl font-bold leading-tight">{activity.title}</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-white/50">{activity.date}</p>
      <Description text={activity.description} title={activity.title} locale={locale} />
      {/* photos 칸 사진은 맨 아래 모음. 본문에 사진·지도·펼침 항목이 있고 photos 칸이 비었으면 생략 */}
      {!(rich && activity.photos.length === 0) && <PhotoGallery photos={activity.photos} title={activity.title} />}
    </main>
  );
}
