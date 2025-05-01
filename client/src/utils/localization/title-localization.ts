import { Title, TitleImage, TitleTranslation } from '@/graphql/generated/output'

export interface LocalizedTitleData {
    name: string
    overview: string
    tagline: string
    homepage: string
    runtime: number | null
    logoUrl: string
    backdropUrl: string
    posterUrl: string
    originalTitle: Partial<Title>
}

export function getLocalizedTitleStringField(
    translations: TitleTranslation[],
    field: 'title' | 'overview' | 'tagline' | 'homepage',
    locale: string,
    fallback: string = '',
): string {
    const localeTranslation = translations.find(
        t => t?.language?.iso === locale,
    )
    const englishTranslation = translations.find(t => t?.language?.iso === 'en')

    return (
        (localeTranslation?.[field] as string) ||
        (englishTranslation?.[field] as string) ||
        fallback
    )
}

export function getLocalizedTitleNumberField(
    translations: TitleTranslation[],
    field: 'runtime',
    locale: string,
    fallback: number | null = null,
): number | null {
    const localeTranslation = translations.find(
        t => t?.language?.iso === locale,
    )
    const englishTranslation = translations.find(t => t?.language?.iso === 'en')

    return (
        (localeTranslation?.[field] as number | undefined) ??
        (englishTranslation?.[field] as number | undefined) ??
        fallback
    )
}

export function getLocalizedImageUrl(
    images: TitleImage[],
    locale: string,
    fallbackToAny: boolean = true,
): string {
    if (!images?.length) return ''

    const localizedImage = images.find(image => image.iso_639_1 === locale)
    if (localizedImage?.file_path) {
        return `https://image.tmdb.org/t/p/original${localizedImage.file_path}`
    }

    const englishImage = images.find(image => image.iso_639_1 === 'en')
    if (englishImage?.file_path) {
        return `https://image.tmdb.org/t/p/original${englishImage.file_path}`
    }

    if (fallbackToAny && images[0]?.file_path) {
        return `https://image.tmdb.org/t/p/original${images[0].file_path}`
    }

    return ''
}

export function getLocalizedTitleName(
    title: Partial<Title>,
    locale: string,
): string {
    if (!title) return ''

    const translations: TitleTranslation[] = title.translations || []
    if (locale === 'en') {
        return title.originalName || ''
    }

    return (
        getLocalizedTitleStringField(translations, 'title', locale) ||
        title.originalName ||
        ''
    )
}

export function getTitleLogoUrl(title: Partial<Title>, locale: string): string {
    return getLocalizedImageUrl(title.images?.logos || [], locale)
}

export function getTitleBackdropUrl(
    title: Partial<Title>,
    locale: string,
): string {
    return getLocalizedImageUrl(title.images?.backdrops || [], locale)
}

export function getTitlePosterUrl(
    title: Partial<Title>,
    locale: string,
): string {
    return getLocalizedImageUrl(title.images?.posters || [], locale)
}

export function getLocalizedTitleData(
    title: Partial<Title>,
    locale: string,
): LocalizedTitleData {
    const translations: TitleTranslation[] = title.translations || []

    return {
        name: getLocalizedTitleName(title, locale),
        overview: getLocalizedTitleStringField(
            translations,
            'overview',
            locale,
        ),
        tagline: getLocalizedTitleStringField(translations, 'tagline', locale),
        homepage: getLocalizedTitleStringField(
            translations,
            'homepage',
            locale,
        ),
        runtime:
            getLocalizedTitleNumberField(translations, 'runtime', locale) ||
            title.details?.runtime ||
            null,
        logoUrl: getTitleLogoUrl(title, locale),
        backdropUrl: getTitleBackdropUrl(title, locale),
        posterUrl: getTitlePosterUrl(title, locale),
        originalTitle: title,
    }
}
