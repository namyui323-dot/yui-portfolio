import React from 'react';
import { getTranslations } from 'next-intl/server';

export default async function Footer() {
  const t = await getTranslations('footer');
  return (
    <footer className="mb-10 px-4 text-center text-gray-500">
      <small className="text-xs block">{t('text')}</small>
    </footer>
  );
}
