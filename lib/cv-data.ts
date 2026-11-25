// 이력서(CV)와 똑같이 맞춘 경력·학력·역량 데이터.
// 이 세 섹션은 구글 시트 대신 이 파일을 씀 → 내용을 바꾸려면 이 파일을 고쳐서 올리면 됨.
type L = { en: string; ko: string };
type Exp = { role: L; company: L; date: L; location: L; url?: string; summary: L; points: { en: string[]; ko: string[] } };

export const cvExperiences: Exp[] = [
  {
    role: { en: 'International Sales · European Markets', ko: '유럽 시장 전담 해외영업' },
    company: { en: 'MIRAERO KOREA CO., LTD.', ko: '미래로코리아' },
    date: { en: 'Feb 2026 - Present', ko: '2026.02 ~ 현재' },
    location: { en: 'Goyang, South Korea', ko: '경기도 고양시' },
    url: 'https://miraerokorea.kr',
    summary: {
      en: 'K-beauty OEM/ODM and export company. I manage B2B sales for Europe, using competitor analysis and buyer feedback to position products and develop English-language proposals.',
      ko: 'K-뷰티 OEM/ODM·수출 기업에서 유럽 시장을 전담하며, 경쟁 제품과 바이어 요구를 분석해 제품 포지셔닝과 영문 제안 자료를 기획합니다.',
    },
    points: {
      en: [
        'Compared retail prices of 10 products sold in Europe to guide product positioning and listing proposals',
        'Followed up with 33 prospects after K-Beauty Expo, securing 10 buyer meetings and 1 trial order',
        'Built a buyer ordering page that cut response time for initial trial orders from 3 days to 1',
        'Reviewed EU CPNP documents and labels and supported fragrance allergen labeling and PPWR compliance',
        'Coordinated OEM/ODM projects and managed documents and shipping for a US$420K export to Poland',
      ],
      ko: [
        '유럽 유통 제품 10종 소매가 비교를 통해 자사 제품 포지셔닝 분석 및 입점 제안',
        'K-Beauty Expo 이후 잠재 바이어 33곳에 후속 연락해 상담 10건 및 테스트 오더 1건 확보',
        '바이어용 주문 페이지 제작으로 초기 테스트 오더 대응 기간 3일 → 1일 단축',
        'EU CPNP 자료 및 제품 표시사항 검토, 향료 알레르겐 표시·PPWR 대응',
        'OEM/ODM 프로젝트 조율 및 USD 420K 규모 폴란드 수출 프로젝트 문서·선적 일정 관리',
      ],
    },
  },
  {
    role: { en: 'Flagship Store Sales · Corporate Team', ko: '플래그십 스토어 브랜드 세일즈 · 본사 소속' },
    company: { en: 'Puig Korea', ko: '푸치코리아' },
    date: { en: 'Nov 2025 - Jan 2026', ko: '2025.11 ~ 2026.01' },
    location: { en: 'South Korea', ko: '대한민국' },
    summary: { en: 'Global beauty and fragrance group.', ko: '글로벌 뷰티·향수 그룹' },
    points: {
      en: ["Explained and compared products in English and tailored recommendations to international customers' needs"],
      ko: ['외국인 고객 대상 영어 제품 설명 및 니즈 기반 비교·제안 판매'],
    },
  },
  {
    role: { en: 'Regulatory Affairs Associate (RA)', ko: '인허가(RA) 담당' },
    company: { en: 'Cynosure Lutronic', ko: '사이노슈어 루트로닉' },
    date: { en: 'May 2025 - Jul 2025', ko: '2025.05 ~ 2025.07' },
    location: { en: 'South Korea', ko: '대한민국' },
    summary: {
      en: 'Medical aesthetic device company. I reviewed indications and intended use across regulatory documents.',
      ko: '의료미용기기 기업에서 규제 문서의 적응증과 사용목적을 검토했습니다.',
    },
    points: {
      en: [
        'Helped draft FDA submissions and corrected inconsistencies in indications and intended use',
        'Mapped MFDS requirements in Excel and checked regulatory documents for consistency',
        'Shared notes on energy sources and tissue effects for XERF, Hollywood Spectra and 7 other devices',
      ],
      ko: [
        'FDA 제출 문서 작성 지원 및 문서 간 적응증·사용목적 불일치 검토·수정',
        'MFDS 요구사항을 Excel로 매핑하고 규제 문서 간 정합성 점검',
        '세르프(XERF)·할리우드 스펙트라 외 7종 기기의 에너지원과 피부층별 작용 원리를 정리해 팀 내 공유',
      ],
    },
  },
  {
    role: { en: 'Quality Assurance (QA) Intern', ko: '품질보증(QA) 인턴' },
    company: { en: 'PharmaResearch', ko: '파마리서치' },
    date: { en: 'Jan 2025 - Feb 2025', ko: '2025.01 ~ 2025.02' },
    location: { en: 'South Korea', ko: '대한민국' },
    summary: { en: 'Regenerative medicine and skin booster company.', ko: '재생의학·스킨부스터 기업' },
    points: {
      en: ['Supported ESPR review and QA checklist work and studied the properties of PDRN and PN ingredients'],
      ko: ['ESPR 법령·QA 체크리스트 지원 및 PDRN·PN 원료 특성 학습'],
    },
  },
];

export const cvEducation = [
  {
    degree: { en: "Bachelor's in Marine Biofood Science", ko: '해양바이오식품학 학사' },
    school: { en: 'Kangwon National University', ko: '강원대학교' },
    date: { en: 'Mar 2021 - Feb 2025', ko: '2021.03 ~ 2025.02' },
    location: { en: 'Gangwon, South Korea', ko: '강원도' },
    note: { en: 'GPA 4.02 / 4.5 · Thesis on origin labeling and consumer trust', ko: 'GPA 4.02 / 4.5 · 원산지 표시와 소비자 신뢰 관련 논문' },
  },
];

// icon: lib/icons.ts 이름, badge: 아이콘 대신 보이는 짧은 글자
export const cvSkills: { name: L; icon?: string; badge?: string }[] = [
  { name: { en: 'EU CPNP', ko: 'EU CPNP' }, icon: 'shield' },
  { name: { en: 'EU Regulatory (PPWR)', ko: 'EU 규제 대응 (PPWR)' }, icon: 'recycle' },
  { name: { en: 'European B2B', ko: '유럽 B2B' }, icon: 'handshake' },
  { name: { en: 'OEM/ODM', ko: 'OEM/ODM' }, icon: 'factory' },
  { name: { en: 'Project Management', ko: '프로젝트 관리' }, icon: 'checklist' },
  { name: { en: 'Excel', ko: 'Excel' }, icon: 'sheets' },
  { name: { en: 'Apps Script', ko: 'Apps Script' }, icon: 'appsscript' },
  { name: { en: 'Photoshop', ko: 'Photoshop' }, icon: 'photoshop' },
  { name: { en: 'Illustrator', ko: 'Illustrator' }, icon: 'illustrator' },
  { name: { en: 'PowerPoint', ko: 'PowerPoint' }, icon: 'presentation' },
  { name: { en: 'TOEIC 835', ko: 'TOEIC 835' }, badge: 'EN' },
  { name: { en: 'TOEIC Speaking AL', ko: 'TOEIC Speaking AL' }, badge: 'EN' },
  { name: { en: 'IELTS Academic 6.0', ko: 'IELTS Academic 6.0' }, badge: 'EN' },
];
