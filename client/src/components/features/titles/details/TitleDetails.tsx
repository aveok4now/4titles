'use client'

import {
    CountryRelation,
    FindTitleBySlugQuery,
    Title,
} from '@/graphql/generated/output'
import { getLocalizedTitleData } from '@/utils/localization/title-localization'
import { useLocale } from 'next-intl'
import { useSortedCast } from '../hooks/useSortedCast'

import { TitleCastCarouselSection } from './cast/TitleCastCarouselSection'
import { TitleFilmingLocationsSection } from './filming-locations'
import { TitleHeroSection } from './hero/TitleHeroSection'
import { TitleImagesSection } from './images/TitleImagesSection'
import { TitleProductionCompaniesSection } from './production-companies'

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

    const releaseDate = originalTitle.releaseDate
        ? parseReleaseDate(originalTitle.releaseDate)
        : null
    const releaseYear = releaseDate?.getFullYear()

    const voteAverage = originalTitle?.voteAverage || 0
    const popularity = originalTitle?.popularity || 0
    const genres = originalTitle?.genres || []
    const countries =
        originalTitle?.countries?.filter(
            c => c.type === CountryRelation.Production,
        ) || []

    const externalIds = originalTitle.externalIds || {}

    const cast = originalTitle?.credits?.cast || []
    const sortedCast = useSortedCast(cast)

    const filmingLocations = originalTitle?.filmingLocations || []
    const hasLocations =
        originalTitle?.hasLocations || filmingLocations.length > 0

    const productionCompanies = originalTitle?.productionCompanies || []

    const backdrops = originalTitle?.images?.backdrops || []
    const posters = originalTitle?.images?.posters || []
    const logos = originalTitle?.images?.logos || []
    const hasImages =
        backdrops.length > 0 || posters.length > 0 || logos.length > 0

    return (
        <div className='relative h-full overflow-hidden'>
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

            <div className='mx-auto flex flex-col items-center gap-y-8 py-4'>
                {hasImages && (
                    <TitleImagesSection
                        backdrops={backdrops}
                        posters={posters}
                        logos={logos}
                        locale={locale}
                    />
                )}

                {cast.length > 0 && (
                    <TitleCastCarouselSection cast={sortedCast} />
                )}

                {productionCompanies.length > 0 && (
                    <TitleProductionCompaniesSection
                        productionCompanies={productionCompanies}
                    />
                )}

                {hasLocations && (
                    <TitleFilmingLocationsSection
                        filmingLocations={filmingLocations}
                        title={title as Title}
                        locale={locale}
                    />
                )}
            </div>

            {/* TODO: Add favorite button functionality  */}

            {/* <BorderBeam
                size={250}
                duration={15}
                className='from-transparent via-primary to-transparent opacity-40'
            />
            <BorderBeam
                delay={3}
                size={300}
                duration={15}
                className='from-transparent via-accent to-transparent opacity-45'
            /> */}
        </div>
    )
}
