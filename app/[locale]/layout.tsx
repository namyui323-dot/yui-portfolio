import '../styles/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/header';
import ActiveSectionContextProvider from '@/context/active-section-context';
import Footer from '@/components/footer';
import ThemeSwitch from '@/components/theme-switch';
import ThemeContextProvider from '@/context/theme-context';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages, getTranslations } from 'next-intl/server';
import LanguageSelector from '@/components/locale/LanguageSelector';

const inter = Inter({ subsets: ['latin'] });

// 브라우저 탭 제목·검색 설명 (messages의 site 항목 또는 시트 Settings 탭)
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });
  return { title: t('title'), description: t('description') };
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; 
}

export default async function Layout({ children, params }: LayoutProps) {
  
  const { locale } = await params;

  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    notFound();
  }
  return (
    <html lang={locale} className="!scroll-smooth">
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body
          className={`${inter.className} relative pt-28 sm:pt-36 min-h-screen bg-gray-50 text-gray-950 dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90`}
        >
          <div className="bg-[#b0c4de] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#283447]"></div>
          <div className="bg-[#a3b4cc] absolute -z-10 top-[-6rem] left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.7rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[15rem] 2xl:left-[-5rem] dark:bg-[#2b3b51]"></div>
          <ThemeContextProvider>
            <ActiveSectionContextProvider>
              <Header />
              {children}
              <Footer />
              <LanguageSelector />
              <ThemeSwitch />
            </ActiveSectionContextProvider>
          </ThemeContextProvider>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
