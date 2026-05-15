import { useMemo } from 'react'

interface CastMember {
    name?: string | null
    character?: string | null
    profile_path?: string | null
    order?: number | null
}

export function useSortedCast(cast: CastMember[], limit = 20) {
    return useMemo(() => {
        return [...cast]
            .sort((a, b) => {
                if (
                    a.order !== undefined &&
                    a.order !== null &&
                    b.order !== undefined &&
                    b.order !== null
                ) {
                    return a.order - b.order
                }
                if (a.order !== undefined && a.order !== null) return -1
                if (b.order !== undefined && b.order !== null) return 1
                return 0
            })
            .slice(0, limit)
    }, [cast, limit])
}
