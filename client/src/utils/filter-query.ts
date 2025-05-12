import { TitleFilterSchemaType } from '@/schemas/titles-filter.schema'

export function serializeFilterToQuery(
    filter: TitleFilterSchemaType,
): Record<string, string> {
    const result: Record<string, string> = {}

    if (filter.type) {
        result.type = filter.type
    }

    if (filter.category) {
        result.category = filter.category
    }

    if (filter.withFilmingLocations) {
        result.withFilmingLocations = 'true'
    }

    if (filter.name) {
        result.name = filter.name
    }

    if (filter.releaseDateRange) {
        if (filter.releaseDateRange.from) {
            result.dateFrom = filter.releaseDateRange.from
        }
        if (filter.releaseDateRange.to) {
            result.dateTo = filter.releaseDateRange.to
        }
    }

    if (filter.genreIds && filter.genreIds.length > 0) {
        result.genres = filter.genreIds.join(',')
    }

    if (filter.countryIsos && filter.countryIsos.length > 0) {
        result.countries = filter.countryIsos.join(',')
    }

    if (filter.runtimeRange) {
        if (
            filter.runtimeRange.from !== undefined &&
            filter.runtimeRange.from > 0
        ) {
            result.runtimeFrom = filter.runtimeRange.from.toString()
        }
        if (
            filter.runtimeRange.to !== undefined &&
            filter.runtimeRange.to < 300
        ) {
            result.runtimeTo = filter.runtimeRange.to.toString()
        }
    }

    if (filter.originalLanguageIsos && filter.originalLanguageIsos.length > 0) {
        result.language = filter.originalLanguageIsos[0]
    }

    if (filter.voteAverageRange) {
        if (
            filter.voteAverageRange.from !== undefined &&
            filter.voteAverageRange.from > 0
        ) {
            result.ratingFrom = filter.voteAverageRange.from.toString()
        }
        if (
            filter.voteAverageRange.to !== undefined &&
            filter.voteAverageRange.to < 10
        ) {
            result.ratingTo = filter.voteAverageRange.to.toString()
        }
    }

    if (filter.statuses && filter.statuses.length > 0) {
        result.statuses = filter.statuses.join(',')
    }

    if (filter.sortBy) {
        result.sort = filter.sortBy
    }

    return result
}

type SearchParamsLike = {
    get(name: string): string | null
    has(name: string): boolean
}

export function parseQueryToFilter(
    searchParams: SearchParamsLike,
): Partial<TitleFilterSchemaType> {
    const result: Partial<TitleFilterSchemaType> = {}

    if (searchParams.has('type')) {
        result.type = searchParams.get('type') as TitleFilterSchemaType['type']
    }

    if (searchParams.has('category')) {
        result.category = searchParams.get(
            'category',
        ) as TitleFilterSchemaType['category']
    }

    if (searchParams.has('withFilmingLocations')) {
        result.withFilmingLocations =
            searchParams.get('withFilmingLocations') === 'true'
    }

    if (searchParams.has('name')) {
        result.name = searchParams.get('name') || undefined
    }

    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    if (dateFrom || dateTo) {
        result.releaseDateRange = {
            from: dateFrom || undefined,
            to: dateTo || undefined,
        }
    }

    const genres = searchParams.get('genres')
    if (genres) {
        result.genreIds = genres.split(',')
    }

    const countries = searchParams.get('countries')
    if (countries) {
        result.countryIsos = countries.split(',')
    }

    const runtimeFrom = searchParams.get('runtimeFrom')
    const runtimeTo = searchParams.get('runtimeTo')
    if (runtimeFrom || runtimeTo) {
        result.runtimeRange = {
            from: runtimeFrom ? Number(runtimeFrom) : undefined,
            to: runtimeTo ? Number(runtimeTo) : undefined,
        }
    }

    const language = searchParams.get('language')
    if (language) {
        result.originalLanguageIsos = [language]
    }

    const ratingFrom = searchParams.get('ratingFrom')
    const ratingTo = searchParams.get('ratingTo')
    if (ratingFrom || ratingTo) {
        result.voteAverageRange = {
            from: ratingFrom ? Number(ratingFrom) : undefined,
            to: ratingTo ? Number(ratingTo) : undefined,
        }
    }

    const statuses = searchParams.get('statuses')
    if (statuses) {
        result.statuses = statuses.split(
            ',',
        ) as TitleFilterSchemaType['statuses']
    }

    if (searchParams.has('sort')) {
        result.sortBy = searchParams.get(
            'sort',
        ) as TitleFilterSchemaType['sortBy']
    }

    return result
}
