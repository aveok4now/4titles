import type { Genre } from '@/graphql/generated/output'

import { DEFAULT_LANGUAGE } from '@/libs/i18n/config'

export function getLocalizedGenreName(genre: Genre, locale: string): string {
    return locale === DEFAULT_LANGUAGE && genre.name
        ? genre.name
        : genre.englishName || ''
}
