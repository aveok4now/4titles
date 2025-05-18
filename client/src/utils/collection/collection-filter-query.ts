import {
    CollectionFilterSchemaType,
    defaultFilterValues,
} from '@/schemas/collections-filter.schema'

export function serializeFilterToQuery(
    filter: CollectionFilterSchemaType,
): Record<string, string> {
    const result: Record<string, string> = {}

    if (filter.type) {
        result.type = filter.type
    }

    if (filter.mine) {
        result.mine = 'true'
    }

    if (filter.search && filter.search.trim() !== '') {
        result.search = filter.search
    }

    if (filter.sort && filter.sort !== defaultFilterValues.sort) {
        result.sort = filter.sort
    }

    return result
}

type SearchParamsLike = {
    get(name: string): string | null
    has(name: string): boolean
}

export function parseQueryToFilter(
    searchParams: SearchParamsLike,
): Partial<CollectionFilterSchemaType> {
    const result: Partial<CollectionFilterSchemaType> = {}

    if (searchParams.has('type')) {
        const typeValue = searchParams.get('type')
        if (typeValue) {
            result.type = typeValue as CollectionFilterSchemaType['type']
        }
    }

    if (searchParams.has('mine')) {
        result.mine = searchParams.get('mine') === 'true'
    }

    if (searchParams.has('search')) {
        const searchValue = searchParams.get('search')
        if (searchValue && searchValue.trim() !== '') {
            result.search = searchValue
        }
    }

    if (searchParams.has('sort')) {
        const sortValue = searchParams.get('sort')
        if (sortValue && sortValue !== defaultFilterValues.sort) {
            result.sort = sortValue as CollectionFilterSchemaType['sort']
        }
    }

    return result
}
