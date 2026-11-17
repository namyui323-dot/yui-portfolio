import { LocalizedProjectData } from './types';

export const links = [
  { name: 'Home', hash: '#home' },
  { name: 'About', hash: '#about' },
  { name: 'Experience', hash: '#experience' },
  { name: 'Projects', hash: '#projects' },
  { name: 'Skills', hash: '#skills' },
  { name: 'Education', hash: '#education' },
  { name: 'Activities', hash: '#activities' },
  { name: 'Contact', hash: '#contact' },
] as const;

// ✏️ url: 회사 홈페이지 주소. 틀리면 고치고, 없애려면 줄을 지우세요.
export const experiencesData = [
  {
    role: 'Overseas Sales & Export Compliance',
    company: 'MIRAERO KOREA CO., LTD.',
    date: 'Feb 2026 - Present',
    location: 'Goyang, South Korea',
    url: 'https://miraerokorea.kr',
    summary:
      'K-beauty OEM/ODM and export company. I manage European and Russia/CIS accounts for skincare and mask products, including the in-house PRESENT SKIN brand.',
    points: [
      'Account Management: Handling buyers in Poland, Spain, Lithuania, Italy and Russia/CIS from first quote to shipment.',
      'OEM/ODM Projects: Coordinating briefs, samples, MOQs and lead times with partner factories.',
      'Regulatory & Export: Preparing PPWR packaging documentation, allergen labelling, and GMP / ISO 22716 evidence for EU market entry.',
      'Pricing & Brand Support: Building buyer price lists, creating visuals for the PRESENT SKIN brand deck, and preparing the Cosmoprof Asia Awards 2026 entry.',
    ],
  },
  {
    role: 'RA Associate (Contract)',
    company: 'Lutronic',
    date: 'May 2025 - Jul 2025',
    location: 'South Korea',
    url: 'https://www.lutronic.com',
    summary: 'Regulatory affairs for medical aesthetic devices.',
    points: [
      'Supported FDA and CE regulatory submissions.',
      'Built Excel-based compliance maps for MFDS requirements.',
      'Translated complex regulatory requirements into practical workflows for international market entry.',
    ],
  },
  {
    role: 'QA Intern',
    company: 'PharmaResearch',
    date: 'Jan 2025 - Feb 2025',
    location: 'South Korea',
    url: 'https://www.pharmaresearch.co.kr',
    summary: 'Quality assurance in a biotech company.',
    points: [
      'Built a regulatory list for ESPR and labelling compliance checklists aligned with MFDS standards.',
      'Supported QA documentation.',
      'Proposed a Digital Twin QA initiative to improve cross-team collaboration.',
    ],
  },
];

export const educationData = [
  {
    degree: 'Bachelor of Science, College of Life Sciences',
    school: 'Gangneung-Wonju National University',
    date: 'Mar 2021 - Feb 2025',
    location: 'Gangwon, South Korea',
    note: 'GPA 4.02 / 4.5 · Focus on food marketing and sensory science',
  },
  {
    degree: 'Fashion Design',
    school: 'Yeil Design High School',
    date: 'Mar 2018 - Feb 2021',
    location: 'Seoul, South Korea',
    note: '',
  },
];

export const projectsData: LocalizedProjectData[] = [
  {
    translations: {
      en: {
        title: 'Buyer-specific price list system',
        description:
          'Built a tool that applies buyer-specific markups to the master price list and gives each buyer a PIN-protected mobile page to calculate quotes and request proforma invoices.',
      },
      ko: {
        title: '바이어별 가격표 자동화 시스템',
        description:
          '기준 가격표에 바이어별 마크업을 자동 적용하고, 바이어가 PIN으로 접속해 모바일에서 견적 계산과 프로포마 인보이스 요청까지 할 수 있는 도구를 만들었습니다.',
      },
    },
    tags: ['Pricing', 'Apps Script', 'Automation'],
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
        title: 'Packaging & marketing materials for a Russian retail chain',
        description:
          'Over two months, designed packaging for multiple SKUs and produced the marketing support materials for a skincare range proposed to a major Russian grocery retailer.',
      },
      ko: {
        title: '러시아 대형 유통사 제안용 패키지·마케팅 자료',
        description:
          '약 2개월간 러시아 대형 리테일 체인에 제안한 스킨케어 라인의 여러 SKU 패키지를 디자인하고, 마케팅 서포트 자료 일체를 제작했습니다.',
      },
    },
    tags: ['Package Design', 'Marketing', 'Russia'],
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
  }
];

// ✏️ 스킬: icon은 lib/icons.ts에 있는 이름, color는 아이콘 색, badge는 언어처럼 글자 상자로 표시
export const skillsData: { name: string; icon?: string; color?: string; badge?: string }[] = [
  { name: 'Account Management', icon: 'users' },
  { name: 'New Business Development', icon: 'rocket' },
  { name: 'OEM/ODM Project Management', icon: 'factory' },
  { name: 'Export Logistics', icon: 'ship' },
  { name: 'Pricing', icon: 'dollar' },
  { name: 'EU Regulatory (PPWR)', icon: 'recycle' },
  { name: 'Allergen Labelling', icon: 'tags' },
  { name: 'ISO 22716 / GMP', icon: 'shield' },
  { name: 'Brand Marketing', icon: 'megaphone' },
  { name: 'Photoshop', icon: 'photoshop' },
  { name: 'Illustrator', icon: 'illustrator' },
  { name: 'Excel / Google Sheets', icon: 'sheets' },
  { name: 'Korean', badge: 'KR' },
  { name: 'English (C1 · TOEIC 805 · TOEIC Speaking AL)', badge: 'EN' },
  { name: 'Italian (Basic)', badge: 'IT' },
];

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


// ✏️ 활동 사진: public/activities/<slug>/ 폴더에 사진을 넣고 photos 목록에 경로를 적으세요.
//    예) photos: ['/activities/turin/1.jpg', '/activities/turin/2.jpg']
export const activitiesData: {
  slug: string;
  title: string;
  date: string;
  summary: string;
  description: string;
  photos: string[];
}[] = [
  {
    slug: 'turin',
    title: 'Two Months in Turin, Italy',
    date: 'University break',
    summary: 'Lived in Turin for two months during a university break.',
    description:
      'Spent two months living in Turin, Italy, during a university break — an experience that sparked my interest in European markets and the Italian language.',
    photos: [],
  }, 
    {
    slug: 'hup',
    title: 'HUP — Regional Food Brand',
    date: 'May 2024 - Feb 2025',
    summary: 'Ran a year-long tourism–food startup. Secured ₩4M in funding and sold 200+ units.',
    description:
      'Ran a year-long tourism–food startup at university. Secured ₩4M in funding, built the brand identity, and sold 200+ units through social media campaigns.',
    photos: [],
  },
  {
    slug: 'capstone-design',
    title: 'Capstone Design Competition',
    date: 'Sep - Dec 2024',
    summary: 'University capstone design competition. Secured ₩1M in project funding.',
    description:
      'Took part in Gangneung-Wonju National University’s capstone design competition and secured ₩1M in project funding.',
    photos: [],
  },
  {
    slug: 'ai-study-contest',
    title: 'AI Study Methods & Campus Life Contest',
    date: 'Nov 2024',
    summary: 'Selected entry in a university contest on AI study methods and campus life tips.',
    description:
      'My entry on using AI for studying and making the most of university life was selected in a Gangneung-Wonju National University contest.',
    photos: [],
  },
  {
    slug: 'program-design-contest',
    title: 'Extracurricular Program Design Contest',
    date: 'Oct 2023',
    summary: 'Encouragement Award for designing an extracurricular program.',
    description:
      'Received the Encouragement Award in a university contest for designing a new extracurricular program for students.',
    photos: [],
  },
  {
    slug: 'english-speaking-contest',
    title: 'English Speaking Contest',
    date: 'Nov 2021',
    summary: 'Excellence Award at the university English speaking contest.',
    description: 'Received the Excellence Award at Gangneung-Wonju National University’s English speaking contest.',
    photos: [],
  },
];
