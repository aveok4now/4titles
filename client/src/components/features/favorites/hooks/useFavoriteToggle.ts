import {
    FavoriteType,
    useAddToFavoritesMutation,
    useIsEntityFavoriteQuery,
    useRemoveFromFavoritesMutation,
} from '@/graphql/generated/output'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'

export function useFavoriteToggle(
    entityId: string,
    entityType: FavoriteType,
    initialIsFavorite?: boolean,
    entityRelationId?: string,
) {
    const { isAuthenticated } = useAuth()
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite ?? false)
    const [isLoading, setIsLoading] = useState(false)

    const {
        data: isFavoriteData,
        loading: isStatusLoading,
        refetch,
    } = useIsEntityFavoriteQuery({
        variables: {
            input: {
                type: entityType,
                entityId,
                locationTitleId:
                    entityType === FavoriteType.Location
                        ? entityRelationId
                        : null,
            },
        },
        skip: !isAuthenticated || initialIsFavorite !== undefined,
        fetchPolicy: 'cache-and-network',
    })

    const [addToFavorites, { loading: isAdding }] = useAddToFavoritesMutation()
    const [removeFromFavorites, { loading: isRemoving }] =
        useRemoveFromFavoritesMutation()

    useEffect(() => {
        if (isFavoriteData) setIsFavorite(true)
    }, [isFavoriteData])

    useEffect(() => {
        setIsLoading(isStatusLoading || isAdding || isRemoving)
    }, [isStatusLoading, isAdding, isRemoving])

    return {
        isFavorite,
        isLoading,
        refetch,
        addToFavorites,
        removeFromFavorites,
        setIsFavorite,
        setIsLoading,
        isAuthenticated,
    }
}
