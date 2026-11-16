'use client';

import React from 'react';
import SectionHeading from './section-heading';
import { projectsData } from '@/lib/data';
import Project from './project';
import { useSectionInView } from '@/lib/hooks';
import { useTranslations } from 'next-intl';

export default function Projects() {
  const t = useTranslations('myProjects');
  const { ref } = useSectionInView('Projects', 0.3);

  return (
    <section ref={ref} id="projects" className="scroll-mt-28 mb-28 sm:mb-40 w-full max-w-[52rem]">
      <SectionHeading>{t('Header')}</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
        {projectsData.map((project, index) => (
          <Project key={index} {...project} index={index} />
        ))}
      </div>
    </section>
  );
}
