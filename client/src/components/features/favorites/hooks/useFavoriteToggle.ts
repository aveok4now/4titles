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
    const [isFavorite, setIsFavorite] = useState<boolean | undefined>(
        initialIsFavorite,
    )
    const [isLoadingCombined, setIsLoadingCombined] = useState(false)

    const {
        data: isFavoriteData,
        loading: isFetchingInitialStatus,
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
        if (initialIsFavorite === undefined && isFavoriteData !== undefined) {
            setIsFavorite(!!isFavoriteData?.isEntityFavorite)
        }
    }, [isFavoriteData, initialIsFavorite])

    useEffect(() => {
        const currentIsFetchingInitial =
            initialIsFavorite === undefined && isFetchingInitialStatus
        setIsLoadingCombined(currentIsFetchingInitial || isAdding || isRemoving)
    }, [isFetchingInitialStatus, isAdding, isRemoving, initialIsFavorite])

    const finalIsFavorite =
        initialIsFavorite === undefined && isFetchingInitialStatus
            ? undefined
            : isFavorite

    return {
        isFavorite: finalIsFavorite,
        isLoading: isLoadingCombined,
        isFetchingInitialStatus:
            initialIsFavorite === undefined && isFetchingInitialStatus,
        refetch,
        addToFavorites,
        removeFromFavorites,
        setIsFavorite,
        setIsLoading: setIsLoadingCombined,
        isAuthenticated,
    }
}
