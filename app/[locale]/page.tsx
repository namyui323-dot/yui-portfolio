import Intro from '@/components/intro';
import SectionDivider from '@/components/section-divider';
import About from '@/components/about';
import Projects from '@/components/projects';
import Skills from '@/components/skills';
import Experience from '@/components/experience';
import Education from '@/components/education';
import Activities from '@/components/activities';
import Contact from '@/components/contact';
import { getExperiences, getProjects, getActivities, getEducation, getSkills } from '@/lib/sheet';
import { getLocale } from 'next-intl/server';

// 구글 시트 내용을 60초마다 다시 읽음
export const revalidate = 60;

export default async function Home() {
  const locale = await getLocale();
  const [experiences, projects, activities, education, skills] = await Promise.all([
    getExperiences(locale),
    getProjects(),
    getActivities(locale),
    getEducation(locale),
    getSkills(locale),
  ]);

  return (
    <main className="flex flex-col items-center px-4">
      <Intro />
      <SectionDivider />
      <About />
      <Experience items={experiences} />
      <Projects items={projects} />
      <Skills items={skills} />
      <Education items={education} />
      <Activities items={activities} />
      <Contact />
    </main>
  );
}
