'use client'

import { FindTitleBySlugQuery, Title } from '@/graphql/generated/output'
import { useLocale } from 'next-intl'
import { useTitleDetailedInfo } from '../hooks'
import { useSortedCast } from '../hooks/useSortedCast'
import { TitleCastCarouselSection } from './cast/TitleCastCarouselSection'
import { TitleCommentsSection } from './comments'
import { TitleFilmingLocationsSection } from './filming-locations'
import { TitleHeroSection } from './hero/TitleHeroSection'
import { TitleImagesSection } from './images/TitleImagesSection'
import { TitleProductionCompaniesSection } from './production-companies'

interface TitleDetailsProps {
    title: FindTitleBySlugQuery['findTitleBySlug']
}

export function TitleDetails({ title }: TitleDetailsProps) {
    const locale = useLocale()

    const details = useTitleDetailedInfo(title as Title)
    const { originalTitle } = details

    const cast = originalTitle?.credits?.cast || []
    const sortedCast = useSortedCast(cast)

    const filmingLocations = originalTitle?.filmingLocations || []

    const productionCompanies = originalTitle?.productionCompanies || []

    const backdrops = originalTitle?.images?.backdrops || []
    const posters = originalTitle?.images?.posters || []
    const logos = originalTitle?.images?.logos || []
    const hasImages =
        backdrops.length > 0 || posters.length > 0 || logos.length > 0

    return (
        <div className='relative h-full overflow-hidden'>
            <TitleHeroSection details={details} />

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

                <TitleFilmingLocationsSection
                    filmingLocations={filmingLocations}
                    title={title as Title}
                    locale={locale}
                />

                <TitleCommentsSection title={title as Title} locale={locale} />
            </div>
        </div>
    )
}
