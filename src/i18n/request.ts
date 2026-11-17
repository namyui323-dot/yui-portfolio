import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'
import { applySheetMessages } from '@/lib/sheet'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  const base = (await import(`@/messages/${locale}.json`)).default
  // 구글 시트 Settings 탭 문구가 있으면 덮어씀
  const messages = await applySheetMessages(base, locale)

  return { locale, messages }
})
