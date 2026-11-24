import { createTranslator } from 'next-intl';
import { experiencesData, projectsData, activitiesData, educationData, skillsData } from './data';

// ✏️ 구글 시트 ID: 시트 주소 docs.google.com/spreadsheets/d/【여기 부분】/edit 을 따옴표 안에 붙여넣으세요.
// 비워두면 messages/*.json, lib/data.ts 내용이 그대로 쓰입니다.
export const SHEET_ID = '1CGL2NkzVeWvsmYy1EAHRXDZOUcpFz5rQSuq3cCINNug';

// https://docs.google.com/spreadsheets/d/1CGL2NkzVeWvsmYy1EAHRXDZOUcpFz5rQSuq3cCINNug/edit?usp=sharing

// 시트를 다시 읽는 간격(초). 60 = 시트 수정 후 약 1분 뒤 사이트에 반영
export const REVALIDATE_SECONDS = 60;

export type Experience = (typeof experiencesData)[number];
export type Project = Omit<(typeof projectsData)[number], 'imageUrl'> & { imageUrl?: any };
export type Activity = (typeof activitiesData)[number];
export type Education = (typeof educationData)[number];
export type Skill = (typeof skillsData)[number];

// ───────── 이미지·파일 링크 변환 ─────────
// 구글 드라이브 공유 링크에서 파일 ID 추출
function driveId(url: string): string | null {
  const m = url.match(/\/(?:file\/)?d\/([a-zA-Z0-9_-]{10,})/) || url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  return url.includes('google.com') && m ? m[1] : null;
}
// 드라이브 링크 → 이미지로 바로 쓸 수 있는 주소. /로 시작하는 GitHub 경로나 다른 주소는 그대로
export function toImageUrl(v: string): string {
  const id = driveId(v);
  return id ? `https://lh3.googleusercontent.com/d/${id}` : v;
}
// 드라이브 링크 → 바로 다운로드되는 주소 (CV PDF용)
export function toDownloadUrl(v: string): string {
  const id = driveId(v);
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : v;
}

// ───────── CSV 읽기 ─────────
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

async function readTab(tab: string): Promise<Record<string, string>[] | null> {
  if (!SHEET_ID) return null;
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(tab)}`;
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    const text = await res.text();
    if (text.trim().startsWith('<')) return null; // 공유 설정이 안 돼 있으면 HTML이 옴
    const [header, ...body] = parseCSV(text);
    if (!header) return null;
    const keys = header.map((h) => h.trim().toLowerCase());
    return body
      .map((cells) => Object.fromEntries(keys.map((k, i) => [k, (cells[i] ?? '').trim()])))
      .filter((r) => Object.values(r).some((v) => v !== ''))
      .filter((r) => !['n', 'no', 'x', '숨김'].includes((r.show ?? '').toLowerCase()));
  } catch {
    return null;
  }
}

const lines = (v: string) => v.split(/\n/).map((s) => s.trim()).filter(Boolean);
const list = (v: string) => v.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);

// ───────── 섹션별 데이터 ─────────
export async function getExperiences(): Promise<Experience[]> {
  const rows = await readTab('Experience');
  if (!rows || rows.length === 0) return experiencesData;
  return rows.map((r) => ({
    role: r.role,
    company: r.company,
    date: r.date,
    location: r.location,
    url: r.url,
    summary: r.summary,
    points: lines(r.points ?? ''),
  }));
}

export async function getProjects(): Promise<Project[]> {
  const rows = await readTab('Projects');
  if (!rows || rows.length === 0) return projectsData;
  return rows.map((r) => ({
    id: r.id || undefined,
    translations: {
      en: { title: r.title_en, description: r.description_en, detail: r.detail_en || undefined },
      ko: { title: r.title_ko || r.title_en, description: r.description_ko || r.description_en, detail: r.detail_ko || r.detail_en || undefined },
    },
    tags: list(r.tags ?? ''),
    imageUrl: r.image ? toImageUrl(r.image) : undefined,
    imageLink: r.link || undefined,
  }));
}

// 활동: 영어는 title·date·summary·description 칸, 한국어는 title_ko·date_ko·summary_ko·description_ko 칸.
// 한국어 칸이 비어 있으면 영어 칸 내용이 그대로 보임
export async function getActivities(locale: string = 'en'): Promise<Activity[]> {
  const rows = await readTab('Activities');
  if (!rows || rows.length === 0) return activitiesData;
  const pick = (r: Record<string, string>, key: string) =>
    (locale === 'ko' && r[`${key}_ko`]) || r[key] || r[`${key}_en`] || '';
  // 대표 카드 사진: cover 칸 → photos 첫 장 → description 안 첫 사진 순서로 사용
  const firstInlineImage = (text: string) => {
    for (const l of text.split(/\n/)) {
      const t = l.trim();
      const m = t.match(/^!\[[^\]]*\]\((\S+)\)$/);
      if (m) return m[1];
      if (/^https?:\/\/\S+$/.test(t)) return t;
    }
    return '';
  };
  return rows
    .filter((r) => r.slug)
    .map((r) => {
      const description = pick(r, 'description');
      const photos = list(r.photos ?? '').map(toImageUrl);
      const cover = r.cover || photos[0] || firstInlineImage(description);
      return {
        slug: r.slug,
        title: pick(r, 'title'),
        date: pick(r, 'date'),
        summary: pick(r, 'summary'),
        description,
        photos,
        featured: ['y', 'yes', 'o', '대표'].includes((r.featured ?? '').toLowerCase()),
        cover: cover ? toImageUrl(cover) : undefined,
      };
    });
}

export async function getEducation(): Promise<Education[]> {
  const rows = await readTab('Education');
  if (!rows || rows.length === 0) return educationData;
  return rows.map((r) => ({
    degree: r.degree,
    school: r.school,
    date: r.date,
    location: r.location,
    note: r.note,
  }));
}

export async function getSkills(): Promise<Skill[]> {
  const rows = await readTab('Skills');
  if (!rows || rows.length === 0) return skillsData;
  return rows
    .filter((r) => r.name)
    .map((r) => ({
      name: r.name,
      icon: r.icon ? r.icon.toLowerCase() : undefined,
      color: r.color || undefined,
      badge: r.badge || undefined,
    }));
}

// ───────── 문구(Settings 탭) → 번역 메시지에 덮어쓰기 ─────────
type Msgs = Record<string, any>;
const RICH = { b: (c: any) => c, i: (c: any) => c, u: (c: any) => c };

// 시트 문구가 깨져 있으면(태그 짝이 안 맞는 등) 사이트가 안 깨지게 원래 문구 유지
function isValid(value: string, locale: string): boolean {
  let ok = true;
  try {
    const t = createTranslator({ locale, messages: { v: value }, onError: () => (ok = false) });
    t.markup('v' as any, RICH as any);
  } catch {
    ok = false;
  }
  return ok;
}

export async function applySheetMessages(base: Msgs, locale: string): Promise<Msgs> {
  const rows = await readTab('Settings');
  if (!rows || rows.length === 0) return base;
  const out: Msgs = JSON.parse(JSON.stringify(base));
  for (const r of rows) {
    const key = r.key;
    if (!key || !key.includes('.')) continue;
    let value = (r[locale] || r.en || '').trim();
    if (!value) continue;
    if (key === 'site.photo') value = toImageUrl(value);
    if (key === 'site.cv') value = toDownloadUrl(value);
    if (!isValid(value, locale)) continue;
    const path = key.split('.');
    let node = out;
    for (const p of path.slice(0, -1)) {
      if (typeof node[p] !== 'object' || node[p] === null) node[p] = {};
      node = node[p];
    }
    node[path[path.length - 1]] = value;
  }
  return out;
}
