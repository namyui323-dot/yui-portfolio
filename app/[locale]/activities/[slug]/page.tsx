import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BsArrowLeft } from 'react-icons/bs';
import { getActivities } from '@/lib/sheet';
import { getLocale, getTranslations } from 'next-intl/server';
import PhotoGallery from '@/components/photo-gallery';

export const revalidate = 60;

// 시트 description 칸: "## 제목" 줄은 소제목, "- 내용" 줄은 목록, 그 외 줄은 문단으로 표시
function Description({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let items: string[] = [];
  const flush = () => {
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
  for (const raw of text.split(/\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('## ')) {
      flush();
      blocks.push(
        <h2 key={`h-${blocks.length}`} className="mt-8 text-xl font-semibold text-gray-900 dark:text-white/90">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith('- ')) {
      items.push(line.slice(2));
    } else {
      flush();
      blocks.push(
        <p key={`p-${blocks.length}`} className="mt-3">
          {line}
        </p>,
      );
    }
  }
  flush();
  return <div className="mt-4 text-lg text-gray-600 leading-relaxed dark:text-white/70">{blocks}</div>;
}

export default async function ActivityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const activity = (await getActivities(locale)).find((a) => a.slug === slug);
  if (!activity) notFound();
  const h = await getTranslations('headings');

  return (
    <main className="mx-auto w-full max-w-[52rem] px-4 mb-28">
      <Link href="/#activities" className="group inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-950 dark:text-white/60 dark:hover:text-white">
        <BsArrowLeft aria-hidden="true" className="transition group-hover:-translate-x-1" />
        {h('BackToActivities')}
      </Link>
      <h1 className="mt-6 text-3xl sm:text-5xl font-bold leading-tight">{activity.title}</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-white/50">{activity.date}</p>
      <Description text={activity.description} />
      <PhotoGallery photos={activity.photos} title={activity.title} />
    </main>
  );
}
