import { TitlesContent } from '@/components/features/titles/catalog/TitlesContent'
import {
    FindAllCountriesDocument,
    FindAllCountriesQuery,
    FindAllGenresDocument,
    FindAllGenresQuery,
    FindAllLanguagesDocument,
    FindAllLanguagesQuery,
    FindTitlesDocument,
    FindTitlesQuery,
    TitleFilterInput,
} from '@/graphql/generated/output'
import { APP_URL, SERVER_URL } from '@/libs/constants/url.constants'
import { parseQueryToFilter } from '@/utils/title/title-filter-query'
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

async function findGenres(): Promise<
    FindAllGenresQuery['findAllGenres'] | null
> {
    try {
        const query = FindAllGenresDocument.loc?.source.body

        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
            }),
        })

        if (!response.ok) {
            throw new Error(`Error fetching genres: ${response.statusText}`)
        }

        const data = await response.json()
        console.log(data)
        return data.data.findAllGenres as FindAllGenresQuery['findAllGenres']
    } catch (error) {
        console.error('Error fetching genres:', error)
        return null
    }
}

async function findCountries(): Promise<
    FindAllCountriesQuery['findAllCountries'] | null
> {
    try {
        const query = FindAllCountriesDocument.loc?.source.body

        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
            }),
        })

        if (!response.ok) {
            throw new Error(`Error fetching countries: ${response.statusText}`)
        }

        const data = await response.json()
        console.log(data)
        return data.data
            .findAllCountries as FindAllCountriesQuery['findAllCountries']
    } catch (error) {
        console.error('Error fetching countries:', error)
        return null
    }
}

async function findLanguages(): Promise<
    FindAllLanguagesQuery['findAllLanguages'] | null
> {
    try {
        const query = FindAllLanguagesDocument.loc?.source.body

        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
            }),
        })

        if (!response.ok) {
            throw new Error(`Error fetching languages: ${response.statusText}`)
        }

        const data = await response.json()
        return data.data
            .findAllLanguages as FindAllLanguagesQuery['findAllLanguages']
    } catch (error) {
        console.error('Error fetching languages:', error)
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
    searchParams: Record<string, string | string[] | undefined>
}) {
    const resolvedSearchParams = await resolveSearchParams(searchParams)
    const searchTerm = resolvedSearchParams.search as string | undefined

    const safeParams: Record<string, string> = {}

    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
        if (typeof value === 'string') {
            safeParams[key] = value
        } else if (Array.isArray(value)) {
            safeParams[key] = value.join(',')
        }
    })

    const parsedFilter = parseQueryToFilter(
        new URL(`${APP_URL}?${new URLSearchParams(safeParams)}`).searchParams,
    ) as TitleFilterInput

    if (searchTerm) parsedFilter.searchTerm = searchTerm

    const [titles, genres, countries, languages] = await Promise.all([
        findTitles(parsedFilter),
        findGenres(),
        findCountries(),
        findLanguages(),
    ])

    return (
        <TitlesContent
            initialData={titles || []}
            metaData={{
                genres: genres || [],
                countries: countries || [],
                languages: languages || [],
            }}
            titlesPerPage={TITLES_PER_PAGE}
            initialCount={INITIAL_TITLES_COUNT}
        />
    )
}
