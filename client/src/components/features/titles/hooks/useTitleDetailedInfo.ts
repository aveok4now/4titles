import { CountryRelation, Title } from '@/graphql/generated/output'
import { parseReleaseDate } from '@/utils/title/parse-release-date'
import { getLocalizedTitleData } from '@/utils/title/title-localization'
import { useLocale } from 'next-intl'
import { useMemo } from 'react'
import { TitleDetailedInfo } from '../types'
import { useTitleBasicInfo } from './useTitleBasicInfo'

export function useTitleDetailedInfo(title: Title): TitleDetailedInfo {
    const locale = useLocale()
    const basicInfo = useTitleBasicInfo(title)

    return useMemo(() => {
        const {
            name,
            overview,
            tagline,
            posterUrl,
            backdropUrl,
            runtime,
            logoUrl,
            originalTitle,
        } = getLocalizedTitleData(title as Title, locale)

        const releaseDate = title.releaseDate
            ? parseReleaseDate(title.releaseDate)
            : null

        const voteAverage = title?.voteAverage || 0
        const popularity = title?.popularity || 0
        const genres = title?.genres || []
        const countries =
            title?.countries?.filter(
                c => c.type === CountryRelation.Production,
            ) || []
        const externalIds = title.externalIds || {}
        const hasLocations =
            title?.hasLocations || (title?.filmingLocations?.length || 0) > 0

        return {
            ...basicInfo,
            name,
            overview,
            tagline,
            backdropUrl,
            runtime,
            releaseDate,
            voteAverage,
            popularity,
            genres,
            countries,
            externalIds,
            hasLocations,
            logoUrl,
            originalTitle: title,
        }
    }, [title, locale, basicInfo])
}
