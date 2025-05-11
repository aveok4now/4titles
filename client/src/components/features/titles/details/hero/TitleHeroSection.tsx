'use client'

import {
    FavoriteType,
    useIsEntityFavoriteQuery,
} from '@/graphql/generated/output'
import { useLocale, useTranslations } from 'next-intl'

import { FavoriteButton } from '@/components/features/favorites/FavoriteButton'
import { Skeleton } from '@/components/ui/common/skeleton'
import FadeContent from '@/components/ui/custom/content/fade-content'

import { TitleDetailedInfo } from '../../types'
import { TitleCountries } from './TitleCountries'
import { TitleGenres } from './TitleGenres'
import { TitleHeader } from './TitleHeader'
import { TitleOverview } from './TitleOverview'
import { TitlePoster } from './TitlePoster'
import { TitleReleaseInfo } from './TitleReleaseInfo'
import { TitleScores } from './TitleScores'
import { TitleSocialLinks } from './TitleSocialLinks'

interface TitleHeroSectionProps {
    details: TitleDetailedInfo
}

export function TitleHeroSection({ details }: TitleHeroSectionProps) {
    const t = useTranslations('titleDetails.hero')
    const locale = useLocale()

    const {
        id: titleId,
        posterUrl,
        name,
        releaseYear,
        tagline,
        releaseDate,
        runtime,
        voteAverage,
        popularity,
        countries,
        genres,
        externalIds,
        overview,
    } = details

    const { data: favoriteData, loading: isLoadingFavorite } =
        useIsEntityFavoriteQuery({
            variables: {
                input: { entityId: titleId, type: FavoriteType.Title },
            },
            fetchPolicy: 'cache-and-network',
        })

    const initialIsFavorite = favoriteData?.isEntityFavorite

    return (
        <FadeContent blur>
            <section className='relative w-full'>
                <div className='container relative mx-auto py-8'>
                    <div className='flex flex-col items-start gap-8 md:flex-row'>
                        <div className='w-full md:w-1/3 lg:w-1/4'>
                            <TitlePoster posterUrl={posterUrl} title={name} />
                        </div>
                        <div className='w-full space-y-4 md:w-2/3 lg:w-3/4'>
                            <div className='flex flex-row items-start justify-between'>
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
                                        size='icon'
                                        className='w-10 md:w-9'
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
