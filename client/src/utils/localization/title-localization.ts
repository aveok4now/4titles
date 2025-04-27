import { Title, TitleImage, TitleTranslation } from '@/graphql/generated/output'

export function getLocalizedTitleName(
    title: Partial<Title>,
    locale: string,
): string {
    if (!title) return ''

    const translations: TitleTranslation[] = title.translations || []
    const localeTranslation = translations.find(
        translation => translation?.language?.iso === locale,
    )

    if (locale === 'en') {
        return title.originalName || ''
    }

    return (
        localeTranslation?.title ||
        translations.find(t => t?.language?.iso === 'en')?.title ||
        title.originalName ||
        ''
    )
}

export function getLocalizedImageUrl(
    images: TitleImage[],
    locale: string,
    fallbackToAny: boolean = true,
): string {
    if (!images?.length) return ''

    const localizedImage = images.find(image => image.iso_639_1 === locale)
    if (localizedImage) {
        return `https://image.tmdb.org/t/p/original${localizedImage.file_path}`
    }

    const englishImage = images.find(image => image.iso_639_1 === 'en')
    if (englishImage) {
        return `https://image.tmdb.org/t/p/original${englishImage.file_path}`
    }

    if (fallbackToAny && images[0]) {
        return `https://image.tmdb.org/t/p/original${images[0].file_path}`
    }

    return ''
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

export interface LocalizedTitleData {
    name: string
    logoUrl: string
    backdropUrl: string
    posterUrl: string
    originalTitle: Partial<Title>
}

export function getLocalizedTitleData(
    title: Partial<Title>,
    locale: string,
): LocalizedTitleData {
    return {
        name: getLocalizedTitleName(title, locale),
        logoUrl: getTitleLogoUrl(title, locale),
        backdropUrl: getTitleBackdropUrl(title, locale),
        posterUrl: getTitlePosterUrl(title, locale),
        originalTitle: title,
    }
}
