import React from 'react';
import { CgWorkAlt } from 'react-icons/cg';
import { LuGraduationCap } from 'react-icons/lu';
import { LocalizedProjectData } from './types';

export const links = [
  { name: 'Home', hash: '#home' },
  { name: 'About', hash: '#about' },
  { name: 'Projects', hash: '#projects' },
  { name: 'Skills', hash: '#skills' },
  { name: 'Experience', hash: '#experience' },
  { name: 'Contact', hash: '#contact' },
] as const;

export const experiencesData = [
  {
    title: 'MIRAERO KOREA CO., LTD. — Overseas Sales & Export Compliance',
    location: 'Goyang, South Korea',
    description:
      'K-beauty OEM/ODM and export company. I manage European and Russia/CIS accounts for skincare and mask products, run OEM/ODM projects with partner factories, handle export documentation and regulatory compliance, and support pricing and brand marketing for the in-house PRESENT SKIN line.',
    icon: React.createElement(CgWorkAlt),
    date: '2026/02 - now',
  },
  {
    title: 'Cynosure Lutronic — RA Associate (Contract)',
    location: 'South Korea',
    description:
      'Supported FDA and CE regulatory submissions for medical devices and built Excel-based compliance maps for MFDS requirements. Translated complex regulatory requirements into practical workflows for international market entry.',
    icon: React.createElement(CgWorkAlt),
    date: '2025/05 - 2025/07',
  },
  {
    title: 'PharmaResearch — QA Intern',
    location: 'South Korea',
    description:
      'Built a regulatory list for ESPR and labelling compliance checklists aligned with MFDS standards, supported QA documentation, and proposed a Digital Twin QA initiative to improve cross-team collaboration.',
    icon: React.createElement(CgWorkAlt),
    date: '2025/01 - 2025/02',
  },
  {
    title: 'Gangneung-Wonju National University',
    location: 'Gangwon, South Korea',
    description:
      'Bachelor of Science, College of Life Sciences (GPA 4.02/4.5), with a focus on food marketing and sensory science. Thesis on how place-of-origin labels shape consumer choice through regional image and quality trust. Founded the regional food brand HUP.',
    icon: React.createElement(LuGraduationCap),
    date: '- 2025/02',
  },
] as const;

export const projectsData: LocalizedProjectData[] = [
  {
    translations: {
      en: {
        title: 'Packaging revision for a major Russian retail chain',
        description:
          'Managed a packaging redesign for a large grocery retailer’s skincare range, keeping design changes, production and export timelines aligned.',
      },
      ko: {
        title: '러시아 대형 유통사 패키지 개정',
        description:
          '러시아 대형 리테일 체인의 스킨케어 제품 패키지 리뉴얼을 담당하며 디자인 변경, 생산, 수출 일정을 조율했습니다.',
      },
    },
    tags: ['Account Management', 'Packaging', 'Russia'],
  },
  {
    translations: {
      en: {
        title: 'EU packaging compliance (PPWR)',
        description:
          'Built compliance documentation under Regulation (EU) 2025/40 for two skincare lines shipped to EU buyers.',
      },
      ko: {
        title: 'EU 포장재 규정(PPWR) 대응',
        description:
          'EU 바이어에게 수출되는 스킨케어 2개 라인에 대해 Regulation (EU) 2025/40 준수 문서를 구축했습니다.',
      },
    },
    tags: ['Regulatory', 'EU', 'Documentation'],
  },
  {
    translations: {
      en: {
        title: 'Onboarding a Baltic distributor',
        description:
          'Closed the documentation gaps a new Lithuanian distributor required — ISO 22716, GMP and RP mandate — so orders could move forward.',
      },
      ko: {
        title: '발트 지역 신규 유통사 온보딩',
        description:
          '리투아니아 신규 유통사가 요구한 ISO 22716, GMP, RP Mandate 서류를 보완해 거래가 진행될 수 있도록 했습니다.',
      },
    },
    tags: ['Market Entry', 'Lithuania', 'GMP'],
  },
  {
    translations: {
      en: {
        title: 'PRESENT SKIN brand deck',
        description:
          'Created and laid out most of the visuals in the brand introduction deck used with overseas buyers.',
      },
      ko: {
        title: 'PRESENT SKIN 브랜드 소개서',
        description:
          '해외 바이어 대상 브랜드 소개서의 이미지 대부분을 직접 제작하고 레이아웃을 구성했습니다.',
      },
    },
    tags: ['Brand', 'Photoshop', 'Illustrator'],
  },
  {
    translations: {
      en: {
        title: 'Cosmoprof Asia Awards 2026 entry',
        description:
          'Prepared the product entries and submission for the brand’s award application.',
      },
      ko: {
        title: 'Cosmoprof Asia Awards 2026 출품',
        description: '브랜드 어워드 출품을 위한 제품 엔트리와 제출 절차를 준비했습니다.',
      },
    },
    tags: ['Brand', 'Trade Show'],
  },
  {
    translations: {
      en: {
        title: 'HUP — regional food brand',
        description:
          'Ran a year-long tourism–food startup at university. Secured ₩4M in funding, built the brand identity, and sold 200+ units through social media campaigns.',
      },
      ko: {
        title: 'HUP — 지역 식품 브랜드',
        description:
          '대학 창업동아리로 1년간 관광·식품 스타트업을 운영했습니다. 사업비 400만 원을 확보하고, 브랜드 아이덴티티를 직접 만들어 SNS 캠페인으로 200개 이상 판매했습니다.',
      },
    },
    tags: ['Founder', 'Brand Identity', 'Social Media'],
  },
];

export const skillsData = [
  'Account Management',
  'New Business Development',
  'OEM/ODM Project Management',
  'Export Logistics',
  'Pricing',
  'EU Regulatory (PPWR)',
  'Allergen Labelling',
  'ISO 22716 / GMP',
  'Brand Marketing',
  'Photoshop',
  'Illustrator',
  'Excel / Google Sheets',
  'Korean (Native)',
  'English (C1 · TOEIC 805 · TOEIC Speaking AL)',
  'Italian (Basic)',
] as const;

export const skillColors = [
  'bg-blue-200',
  'bg-green-200',
  'bg-purple-200',
  'bg-pink-200',
  'bg-orange-200',
  'bg-red-200',
  'bg-gray-200',
  'bg-teal-200',
  'bg-indigo-200',
  'bg-cyan-200',
  'bg-lime-200',
] as const;
