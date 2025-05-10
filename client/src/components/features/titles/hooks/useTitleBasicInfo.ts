import { CountryRelation, Title } from '@/graphql/generated/output'
import { parseReleaseDate } from '@/utils/title/parse-release-date'
import {
    getLocalizedTitleName,
    getTitleBackdropUrl,
    getTitlePosterUrl,
} from '@/utils/title/title-localization'
import { useLocale } from 'next-intl'
import { useMemo } from 'react'
import { TitleBasicInfo } from '../types'

export function useTitleBasicInfo(title: Title): TitleBasicInfo {
    const locale = useLocale()

    return useMemo(() => {
        const name = getLocalizedTitleName(title, locale)
        const posterUrl = getTitlePosterUrl(title, locale)
        const backdropUrl = getTitleBackdropUrl(title, locale)

        const releaseDate = title.releaseDate
            ? parseReleaseDate(title.releaseDate)
            : null
        const releaseYear = releaseDate?.getFullYear()

        const countries =
            title?.countries?.filter(
                c => c.type === CountryRelation.Production,
            ) || []
        const productionCountry =
            countries.length > 0
                ? {
                      iso: countries[0].country.iso,
                      name: countries[0].country.name,
                  }
                : null

        return {
            id: title.id || '',
            slug: title.slug,
            name,
            posterUrl,
            backdropUrl,
            releaseYear,
            productionCountry,
        }
    }, [title, locale])
}
