import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BsArrowLeft } from 'react-icons/bs';
import { getActivities } from '@/lib/sheet';
import { getTranslations } from 'next-intl/server';

export const revalidate = 60;
import PhotoGallery from '@/components/photo-gallery';

export default async function ActivityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activity = (await getActivities()).find((a) => a.slug === slug);
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
      <p className="mt-4 text-lg text-gray-600 leading-relaxed dark:text-white/70">{activity.description}</p>
      <PhotoGallery photos={activity.photos} title={activity.title} />
    </main>
  );
}
