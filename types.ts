import { StaticImageData } from 'next/image';
import { links } from './data';

export type SectionName = (typeof links)[number]['name'];

export interface LocalizedProjectData {
  // 프로젝트 번호(P_01 등). public/projects/P_01.mp4 처럼 같은 이름의 파일이 있으면 카드 미리보기로 자동 사용
  id?: string;
  translations: {
    en: { title: string; description: string };
    ko: { title: string; description: string };
  };
  tags: string[];
  // 프로젝트 이미지가 있으면 public/ 폴더에 넣고 import해서 연결하세요. 없으면 텍스트 카드로 표시됩니다.
  imageUrl?: StaticImageData | string;
  imageLink?: string;
}
