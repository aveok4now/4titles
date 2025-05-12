import { TitlesContent } from '@/components/features/titles/catalog/TitlesContent'
import {
    FindTitlesDocument,
    FindTitlesQuery,
    TitleFilterInput,
    TitleType,
} from '@/graphql/generated/output'
import { SERVER_URL } from '@/libs/constants/url.constants'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

const INITIAL_TITLES_COUNT = 24
const TITLES_PER_PAGE = 12

async function findTitles(
    filter: TitleFilterInput,
): Promise<FindTitlesQuery['findTitles'] | null> {
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
                        take: INITIAL_TITLES_COUNT,
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

        if (data.errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`)
        }

        return data.data.findTitles as FindTitlesQuery['findTitles']
    } catch (error) {
        console.error('Error fetching titles:', error)
        return null
    }
}

async function resolveSearchParams<T>(searchParams: T): Promise<T> {
    return searchParams
}

export async function generateMetadata(props: {
    searchParams: { search?: string }
}): Promise<Metadata> {
    const t = await getTranslations('titles')
    const resolvedParams = await resolveSearchParams(props.searchParams)
    const { search } = resolvedParams

    return {
        title: search
            ? `${t('searchHeading', { query: search })}`
            : t('heading'),
        description: t('description'),
    }
}
export default async function TitlesPage({
    searchParams,
}: {
    searchParams: { search?: string; type?: string }
}) {
    const resolvedParams = await resolveSearchParams(searchParams)
    const searchTerm = resolvedParams.search
    const tabType = resolvedParams.type

    const [allTitles, movieTitles, seriesTitles] = await Promise.all([
        findTitles({
            searchTerm,
        }),
        findTitles({
            searchTerm,
            type: TitleType.Movie,
        }),
        findTitles({
            searchTerm,
            type: TitleType.Tv,
        }),
    ])

    const initialData = {
        all: allTitles || [],
        movies: movieTitles || [],
        series: seriesTitles || [],
    }

    let defaultTab = 'all'
    if (tabType === 'movies') defaultTab = 'movies'
    if (tabType === 'series') defaultTab = 'series'

    return (
        <TitlesContent
            initialData={initialData}
            defaultTab={defaultTab}
            titlesPerPage={TITLES_PER_PAGE}
            initialCount={INITIAL_TITLES_COUNT}
        />
    )
}
