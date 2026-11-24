'use client';

import React, { useEffect, useMemo, useRef } from 'react';

// 활동 상세 페이지의 이동 경로 지도 (Leaflet을 CDN에서 불러옴, 설치 불필요)
// description 칸에 이렇게 한 줄:  [지도] 토리노 (2개월 거주) > 파르마 > 피사 > 볼로냐 (FICO, Ragù) > ...
// 괄호 안 메모는 핀을 누르면 보임. 목록에 없는 도시는  이름@위도,경도  로 적기  예) 알바@44.70,8.03

const CITIES: Record<string, [number, number, string, string]> = {
  // key: [위도, 경도, 영어 이름, 한국어 이름]
  토리노: [45.0703, 7.6869, 'Turin', '토리노'],
  turin: [45.0703, 7.6869, 'Turin', '토리노'],
  torino: [45.0703, 7.6869, 'Turin', '토리노'],
  파르마: [44.8015, 10.3279, 'Parma', '파르마'],
  parma: [44.8015, 10.3279, 'Parma', '파르마'],
  피사: [43.7228, 10.4017, 'Pisa', '피사'],
  pisa: [43.7228, 10.4017, 'Pisa', '피사'],
  볼로냐: [44.4949, 11.3426, 'Bologna', '볼로냐'],
  bologna: [44.4949, 11.3426, 'Bologna', '볼로냐'],
  피렌체: [43.7696, 11.2558, 'Florence', '피렌체'],
  florence: [43.7696, 11.2558, 'Florence', '피렌체'],
  firenze: [43.7696, 11.2558, 'Florence', '피렌체'],
  로마: [41.9028, 12.4964, 'Rome', '로마'],
  rome: [41.9028, 12.4964, 'Rome', '로마'],
  roma: [41.9028, 12.4964, 'Rome', '로마'],
  나폴리: [40.8518, 14.2681, 'Naples', '나폴리'],
  naples: [40.8518, 14.2681, 'Naples', '나폴리'],
  napoli: [40.8518, 14.2681, 'Naples', '나폴리'],
  밀라노: [45.4642, 9.19, 'Milan', '밀라노'],
  milan: [45.4642, 9.19, 'Milan', '밀라노'],
  베네치아: [45.4408, 12.3155, 'Venice', '베네치아'],
  venice: [45.4408, 12.3155, 'Venice', '베네치아'],
  알바: [44.7003, 8.0353, 'Alba', '알바'],
  alba: [44.7003, 8.0353, 'Alba', '알바'],
  강릉: [37.7519, 128.8761, 'Gangneung', '강릉'],
  gangneung: [37.7519, 128.8761, 'Gangneung', '강릉'],
  원주: [37.3422, 127.9202, 'Wonju', '원주'],
  wonju: [37.3422, 127.9202, 'Wonju', '원주'],
  춘천: [37.8813, 127.7298, 'Chuncheon', '춘천'],
  chuncheon: [37.8813, 127.7298, 'Chuncheon', '춘천'],
  서울: [37.5665, 126.978, 'Seoul', '서울'],
  seoul: [37.5665, 126.978, 'Seoul', '서울'],
};

type Stop = { name: string; lat: number; lng: number; note?: string };

function parseRoute(spec: string, locale: string): Stop[] {
  return spec
    .split('>')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((part): Stop | null => {
      const note = part.match(/\(([^)]*)\)\s*$/)?.[1]?.trim();
      const base = part.replace(/\([^)]*\)\s*$/, '').trim();
      const custom = base.match(/^(.+?)@\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
      if (custom) return { name: custom[1].trim(), lat: +custom[2], lng: +custom[3], note };
      const c = CITIES[base.toLowerCase()];
      if (!c) return null;
      return { name: locale === 'ko' ? c[3] : c[2], lat: c[0], lng: c[1], note };
    })
    .filter((s): s is Stop => s !== null);
}

const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

function loadLeaflet(): Promise<any> {
  const w = window as any;
  if (w.L) return Promise.resolve(w.L);
  if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = LEAFLET_CSS;
    document.head.appendChild(link);
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${LEAFLET_JS}"]`) as HTMLScriptElement | null;
    const s = existing ?? document.createElement('script');
    s.addEventListener('load', () => resolve(w.L));
    s.addEventListener('error', reject);
    if (!existing) {
      s.src = LEAFLET_JS;
      document.body.appendChild(s);
    }
  });
}

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ESC[c] ?? c);

export default function RouteMap({ spec, locale }: { spec: string; locale: string }) {
  const el = useRef<HTMLDivElement>(null);
  const stops = useMemo(() => parseRoute(spec, locale), [spec, locale]);

  useEffect(() => {
    let map: any;
    let cancelled = false;
    loadLeaflet()
      .then((L) => {
        if (cancelled || !el.current || stops.length === 0) return;
        map = L.map(el.current, { scrollWheelZoom: false, attributionControl: true });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        const pts = stops.map((s) => [s.lat, s.lng]);
        L.polyline(pts, { color: '#e11d48', weight: 3, opacity: 0.8, dashArray: '6 8' }).addTo(map);

        // 같은 장소(출발=도착)는 핀 하나에 번호를 같이 표시
        const seen = new Map<string, { stop: Stop; nums: number[] }>();
        stops.forEach((s, i) => {
          const key = `${s.lat},${s.lng}`;
          const hit = seen.get(key);
          if (hit) hit.nums.push(i + 1);
          else seen.set(key, { stop: s, nums: [i + 1] });
        });
        seen.forEach(({ stop, nums }) => {
          const label = nums.length > 1 ? `${nums[0]}·${nums[nums.length - 1]}` : `${nums[0]}`;
          const icon = L.divIcon({
            className: '',
            html: `<div style="background:#e11d48;color:#fff;border:2px solid #fff;border-radius:9999px;min-width:26px;height:26px;padding:0 6px;display:flex;align-items:center;justify-content:center;font:600 12px/1 system-ui;box-shadow:0 1px 4px rgba(0,0,0,.35)">${label}</div>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          });
          L.marker([stop.lat, stop.lng], { icon })
            .addTo(map)
            .bindPopup(`<strong>${esc(stop.name)}</strong>${stop.note ? `<br/>${esc(stop.note)}` : ''}`)
            .bindTooltip(esc(stop.name), { direction: 'top', offset: [0, -14] });
        });

        map.fitBounds(L.latLngBounds(pts), { padding: [30, 30] });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [stops]);

  return (
    <div className="mt-6">
      <div ref={el} className="relative z-0 h-[22rem] sm:h-[28rem] w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-white/5" />
      <ol className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 dark:text-white/50">
        {stops.map((s, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">→</span>}
            <span>{s.name}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
