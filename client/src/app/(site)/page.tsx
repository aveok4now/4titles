import {
    FindTitlesDocument,
    GetCountriesStatisticsDocument,
    type TitleFilterInput,
    TitleType,
} from '@/graphql/generated/output'

import { ContentCarouselSection } from '@/components/features/common/ContentCarouselSection'
import { HomeAboutGrid } from '@/components/features/home/HomeAboutGrid'
import { HomeCountriesMarquee } from '@/components/features/home/HomeCountriesMarquee'
import { TitlesCarousel } from '@/components/features/titles/TitlesCarousel'
import { SERVER_URL } from '@/libs/constants/url.constants'
import { getTranslations } from 'next-intl/server'

async function findTitles(filter: TitleFilterInput) {
    try {
        const query = FindTitlesDocument.loc?.source.body

        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {
                    filter: {
                        withFilmingLocations: true,
                        take: 20,
                        ...filter,
                    },
                },
            }),
            next: {
                revalidate: 30,
            },
        })

        if (!response.ok) {
            throw new Error(`Error fetching titles: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data.findTitles
    } catch (error) {
        console.error('Error fetching titles:', error)
        return null
    }
}

async function getCountriesStatistics() {
    try {
        const query = GetCountriesStatisticsDocument.loc?.source.body

        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {
                    input: {
                        limit: 30,
                        withFilmingLocationsOnly: true,
                    },
                },
            }),
            next: {
                revalidate: 60,
            },
        })

        if (!response.ok) {
            throw new Error(
                `Error fetching countries statistics: ${response.statusText}`,
            )
        }

        const data = await response.json()
        return data.data.getCountriesStatistics
    } catch (error) {
        console.error('Error fetching countries statistics:', error)
        return null
    }
}

export default async function HomePage() {
    const t = await getTranslations('home')

    const [movies, series, countriesStats] = await Promise.all([
        findTitles({ type: TitleType.Movie }),
        findTitles({ type: TitleType.Tv }),
        getCountriesStatistics(),
    ])

    const allTitles = [...(movies || []), ...(series || [])].slice(0, 30)

    return (
        <div className='space-y-12'>
            <HomeAboutGrid titles={allTitles} />

            {movies && movies.length > 0 && (
                <ContentCarouselSection
                    heading={t('movies.heading')}
                    description={t('movies.description')}
                    viewAllHref='/titles?type=MOVIE'
                    viewAllLabel={t('viewAll')}
                >
                    <TitlesCarousel titles={movies} />
                </ContentCarouselSection>
            )}

            {series && series.length > 0 && (
                <ContentCarouselSection
                    heading={t('series.heading')}
                    description={t('series.description')}
                    viewAllHref='/titles?type=TV'
                    viewAllLabel={t('viewAll')}
                >
                    <TitlesCarousel titles={series} />
                </ContentCarouselSection>
            )}

            {countriesStats && countriesStats.length > 0 && (
                <ContentCarouselSection
                    heading={t('countries.heading')}
                    description={t('countries.description')}
                    viewAllHref='/countries'
                    viewAllLabel={t('viewAll')}
                >
                    <HomeCountriesMarquee countries={countriesStats} />
                </ContentCarouselSection>
            )}
        </div>
    )
}
