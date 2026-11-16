# Yui Portfolio

개인 포트폴리오 웹사이트입니다.
(Next.js + TypeScript + Tailwind CSS + Framer Motion, 한국어/영어 전환, 다크 모드)

## 꼭 바꿔야 할 것 (✏️ 표시된 곳)

- `components/intro.tsx` — 프로필 사진, LinkedIn 주소, 이력서 PDF 파일명
- `components/contact.tsx` — 개인 이메일
- `public/` 폴더 — `profile.jpg`, `CV_Yui.pdf` 넣기
- `lib/data.ts` — `[ ]`로 표시된 경력·프로젝트 설명 채우기, 프로젝트 이미지 연결(선택)
- `messages/en.json`, `messages/ko.json` — 소개 문구

## 내 컴퓨터에서 실행

```bash
npm install
npm run dev
```
http://localhost:3000 에서 확인

## 무료 배포 (Vercel)

1. GitHub에 새 저장소를 만들고 이 폴더를 올립니다.
2. vercel.com 에 GitHub로 로그인 → Add New Project → 저장소 선택 → Deploy.
3. 나온 주소(예: yui-portfolio.vercel.app)를 LinkedIn 프로필에 연결합니다.
