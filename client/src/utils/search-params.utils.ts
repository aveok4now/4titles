export type SearchParamsValue = string | string[] | undefined
export type SearchParamsObject = Record<string, SearchParamsValue>

export function normalizeSearchParams(
    searchParams: SearchParamsObject,
): Record<string, string> {
    const safeParams: Record<string, string> = {}

    Object.entries(searchParams).forEach(([key, value]) => {
        if (typeof value === 'string') {
            safeParams[key] = value
        } else if (Array.isArray(value)) {
            safeParams[key] = value.join(',')
        }
    })

    return safeParams
}

export async function resolveSearchParams<T extends SearchParamsObject>(
    searchParams: T,
): Promise<T> {
    return searchParams
}
