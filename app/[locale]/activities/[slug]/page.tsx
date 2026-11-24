import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BsArrowLeft } from 'react-icons/bs';
import { getActivities, toImageUrl } from '@/lib/sheet';
import { getLocale, getTranslations } from 'next-intl/server';
import PhotoGallery from '@/components/photo-gallery';
import InlineGallery, { type InlineImage } from '@/components/inline-gallery';

export const revalidate = 60;

// 시트 description 칸 쓰는 법
//   ## 소제목          → 소제목
//   - 내용             → 목록
//   ![설명](사진 링크)  → 그 자리에 사진 (설명은 사진 아래 작은 글씨, 비워도 됨)
//   사진 링크만 한 줄    → 설명 없는 사진
//   사진 줄을 연달아 쓰면 2열로 묶여서 보임
const IMG_MD = /^!\[([^\]]*)\]\((\S+)\)$/;
const IMG_URL = /^(https?:\/\/\S+|\/\S+\.(?:jpe?g|png|gif|webp|avif))$/i;

function parseImage(line: string): InlineImage | null {
  const m = line.match(IMG_MD);
  if (m) return { src: toImageUrl(m[2]), caption: m[1].trim() || undefined };
  if (IMG_URL.test(line)) return { src: toImageUrl(line) };
  return null;
}

function hasInlineImages(text: string) {
  return text.split(/\n/).some((l) => parseImage(l.trim()));
}

function Description({ text, title }: { text: string; title: string }) {
  const blocks: ReactNode[] = [];
  let items: string[] = [];
  let images: InlineImage[] = [];
  const flushList = () => {
    if (items.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="mt-3 list-disc space-y-2 pl-5">
          {items.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>,
      );
      items = [];
    }
  };
  const flushImages = () => {
    if (images.length) {
      blocks.push(<InlineGallery key={`img-${blocks.length}`} images={images} title={title} />);
      images = [];
    }
  };
  for (const raw of text.split(/\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const img = parseImage(line);
    if (img) {
      flushList();
      images.push(img);
      continue;
    }
    flushImages();
    if (line.startsWith('## ')) {
      flushList();
      blocks.push(
        <h2 key={`h-${blocks.length}`} className="mt-10 text-xl font-semibold text-gray-900 dark:text-white/90">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith('- ')) {
      items.push(line.slice(2));
    } else {
      flushList();
      blocks.push(
        <p key={`p-${blocks.length}`} className="mt-3">
          {line}
        </p>,
      );
    }
  }
  flushList();
  flushImages();
  return <div className="mt-4 text-lg text-gray-600 leading-relaxed dark:text-white/70">{blocks}</div>;
}

export default async function ActivityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const activity = (await getActivities(locale)).find((a) => a.slug === slug);
  if (!activity) notFound();
  const h = await getTranslations('headings');
  const inline = hasInlineImages(activity.description);

  return (
    <main className="mx-auto w-full max-w-[52rem] px-4 mb-28">
      <Link href="/#activities" className="group inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-950 dark:text-white/60 dark:hover:text-white">
        <BsArrowLeft aria-hidden="true" className="transition group-hover:-translate-x-1" />
        {h('BackToActivities')}
      </Link>
      <h1 className="mt-6 text-3xl sm:text-5xl font-bold leading-tight">{activity.title}</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-white/50">{activity.date}</p>
      <Description text={activity.description} title={activity.title} />
      {/* photos 칸 사진은 맨 아래 모음으로. 본문에 사진이 있고 photos 칸이 비었으면 생략 */}
      {!(inline && activity.photos.length === 0) && <PhotoGallery photos={activity.photos} title={activity.title} />}
    </main>
  );
}
