import type { Language } from '@/graphql/generated/output'

import { DEFAULT_LANGUAGE } from '@/libs/i18n/config'

export function getLocalizedLanguageName(
    language: Language,
    locale: string,
): string {
    return locale === DEFAULT_LANGUAGE && !!language.nativeName
        ? language.nativeName
        : language.englishName
}
