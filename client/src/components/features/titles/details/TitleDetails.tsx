'use client'

import { Card } from '@/components/ui/common/card'
import { BorderBeam } from '@/components/ui/custom/content/border-beam'
import {
    CountryRelation,
    FindTitleBySlugQuery,
    Title,
} from '@/graphql/generated/output'
import { getLocalizedTitleData } from '@/utils/localization/title-localization'
import { useLocale } from 'next-intl'

import { useSortedCast } from '../hooks/useSortedCast'
import { CastCarousel } from './CastCarousel'
import { TitleHeroSection } from './hero/TitleHeroSection'

interface TitleDetailsProps {
    title: FindTitleBySlugQuery['findTitleBySlug']
}

function parseReleaseDate(dateStr: string | undefined): Date | null {
    if (!dateStr) return null

    const timestamp = Number(dateStr)
    if (!isNaN(timestamp)) {
        return new Date(timestamp)
    }

    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? null : date
}

export function TitleDetails({ title }: TitleDetailsProps) {
    const locale = useLocale()

    const {
        name,
        overview,
        tagline,
        posterUrl,
        backdropUrl,
        runtime,
        originalTitle,
    } = getLocalizedTitleData(title as Title, locale)

    const releaseDate = originalTitle?.details?.release_date
        ? parseReleaseDate(originalTitle.details.release_date)
        : null
    const releaseYear = releaseDate?.getFullYear()

    const voteAverage = originalTitle?.details?.vote_average || 0
    const popularity = originalTitle?.popularity || 0
    const genres = originalTitle?.genres || []
    const countries =
        originalTitle?.countries?.filter(
            c => c.type === CountryRelation.Production,
        ) || []

    const externalIds = originalTitle.externalIds || {}

    const cast = originalTitle?.credits?.cast || []
    const sortedCast = useSortedCast(cast)

    return (
        <Card className='relative overflow-hidden bg-card/90'>
            <TitleHeroSection
                name={name}
                overview={overview}
                tagline={tagline}
                backdropUrl={backdropUrl}
                posterUrl={posterUrl}
                releaseDate={releaseDate}
                releaseYear={releaseYear}
                runtime={runtime!}
                voteAverage={voteAverage}
                popularity={popularity}
                genres={genres}
                countries={countries}
                locale={locale}
                externalIds={externalIds}
            />

            <CastCarousel cast={sortedCast} />

            {/* TODO: Add favorite button functionality  */}

            <BorderBeam
                size={250}
                duration={15}
                className='from-transparent via-primary to-transparent opacity-40'
            />
            <BorderBeam
                delay={3}
                size={300}
                duration={15}
                className='from-transparent via-accent to-transparent opacity-45'
            />
        </Card>
    )
}
