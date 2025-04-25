import { Title, TitleTranslation } from '@/graphql/generated/output'

export function getLocalizedTitleName(title: Title, locale: string): string {
    if (!title) return ''

    const translations: TitleTranslation[] = title.translations || []

    const localeTranslation = translations.find(
        translation => translation?.language?.iso === locale,
    )

    if (locale === 'en') {
        return title.originalName || ''
    }

    if (localeTranslation?.title) {
        return localeTranslation.title
    }

    const englishTranslation = translations.find(
        translation => translation?.language?.iso === 'en',
    )

    return englishTranslation?.title || title.originalName || ''
}
