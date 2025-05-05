'use client'

import type {
    Title,
    TitleCountry,
    TitleGenre,
} from '@/graphql/generated/output'
import {
    FavoriteType,
    useIsTitleFavoriteQuery,
} from '@/graphql/generated/output'

import { FavoriteButton } from '@/components/features/favorites/FavoriteButton'
import { Skeleton } from '@/components/ui/common/skeleton'
import FadeContent from '@/components/ui/custom/content/fade-content'
import { useTranslations } from 'next-intl'
import { TitleCountries } from './TitleCountries'
import { TitleGenres } from './TitleGenres'
import { TitleHeader } from './TitleHeader'
import { TitleOverview } from './TitleOverview'
import { TitlePoster } from './TitlePoster'
import { TitleReleaseInfo } from './TitleReleaseInfo'
import { TitleScores } from './TitleScores'
import { TitleSocialLinks } from './TitleSocialLinks'

interface TitleHeroSectionProps {
    titleId: string
    name: string
    overview?: string
    tagline?: string
    backdropUrl: string | null
    posterUrl: string | null
    releaseDate: Date | null
    releaseYear?: number
    runtime?: number
    voteAverage: number
    popularity?: number
    genres: TitleGenre[]
    countries: TitleCountry[]
    locale: string
    externalIds?: Title['externalIds']
}

export function TitleHeroSection({
    titleId,
    name,
    overview,
    tagline,
    backdropUrl,
    posterUrl,
    releaseDate,
    releaseYear,
    runtime,
    voteAverage,
    popularity,
    genres,
    countries,
    locale,
    externalIds,
}: TitleHeroSectionProps) {
    const t = useTranslations('titleDetails.hero')

    const { data: favoriteData, loading: isLoadingFavorite } =
        useIsTitleFavoriteQuery({
            variables: { titleId },
            fetchPolicy: 'cache-and-network',
        })

    const initialIsFavorite = favoriteData?.isTitleFavorite

    return (
        <FadeContent blur>
            <section className='relative w-full px-4'>
                <div className='container relative mx-auto py-8'>
                    <div className='flex flex-col items-start gap-8 md:flex-row'>
                        <div className='w-full md:w-1/3 lg:w-1/4'>
                            <TitlePoster posterUrl={posterUrl} title={name} />
                        </div>
                        <div className='w-full space-y-4 md:w-2/3 lg:w-3/4'>
                            <div className='flex flex-row justify-between'>
                                <TitleHeader
                                    name={name}
                                    releaseYear={releaseYear}
                                    tagline={tagline}
                                />

                                {isLoadingFavorite ? (
                                    <Skeleton className='size-9 rounded-md' />
                                ) : (
                                    <FavoriteButton
                                        entityId={titleId}
                                        entityType={FavoriteType.Title}
                                        initialIsFavorite={initialIsFavorite}
                                        variant='outline'
                                    />
                                )}
                            </div>

                            <TitleReleaseInfo
                                releaseDate={releaseDate}
                                runtime={runtime}
                                t={t}
                            />
                            <TitleScores
                                voteAverage={voteAverage}
                                popularity={popularity}
                                t={t}
                            />
                            {countries.length > 0 && (
                                <TitleCountries
                                    countries={countries}
                                    locale={locale}
                                    t={t}
                                />
                            )}
                            {genres.length > 0 && (
                                <TitleGenres genres={genres} locale={locale} />
                            )}
                            {externalIds &&
                                Object.values(externalIds).some(id => id) && (
                                    <TitleSocialLinks
                                        externalIds={externalIds}
                                    />
                                )}
                            <TitleOverview overview={overview} t={t} />
                        </div>
                    </div>
                </div>
            </section>
        </FadeContent>
    )
}
