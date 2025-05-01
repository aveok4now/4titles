'use client'

import type {
    Title,
    TitleCountry,
    TitleGenre,
} from '@/graphql/generated/output'

import { useTranslations } from 'next-intl'
import { TitleBackdrop } from './TitleBackdrop'
import { TitleCountries } from './TitleCountries'
import { TitleGenres } from './TitleGenres'
import { TitleHeader } from './TitleHeader'
import { TitleOverview } from './TitleOverview'
import { TitlePoster } from './TitlePoster'
import { TitleReleaseInfo } from './TitleReleaseInfo'
import { TitleScores } from './TitleScores'
import { TitleSocialLinks } from './TitleSocialLinks'

interface TitleHeroSectionProps {
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
    const t = useTranslations('titleDetails')

    return (
        <div className='w-full bg-gradient-to-b from-background/90 via-background/50 to-background/90 px-4 backdrop-blur-sm dark:from-background/90 dark:via-background dark:to-background/90'>
            {backdropUrl && (
                <TitleBackdrop backdropUrl={backdropUrl} name={name} />
            )}
            <div className='container relative z-10 mx-auto py-8'>
                <div className='flex flex-col items-start gap-8 md:flex-row'>
                    <div className='w-full md:w-1/3 lg:w-1/4'>
                        <TitlePoster posterUrl={posterUrl} title={name} />
                    </div>
                    <div className='w-full space-y-4 md:w-2/3 lg:w-3/4'>
                        <TitleHeader
                            name={name}
                            releaseYear={releaseYear}
                            tagline={tagline}
                        />
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
                                <TitleSocialLinks externalIds={externalIds} />
                            )}
                        <TitleOverview overview={overview} t={t} />
                    </div>
                </div>
            </div>
        </div>
    )
}
