import {
    FavorableType,
    useAddToFavoritesMutation,
    useIsFavoriteQuery,
    useRemoveFromFavoritesMutation,
} from '@/graphql/generated/output'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'

export function useFavoriteToggle(
    favorableId: string,
    favorableType: FavorableType,
    favorableContextId?: string,
    initialIsFavorite?: boolean,
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
    } = useIsFavoriteQuery({
        variables: {
            input: {
                favorableType,
                favorableId,
                contextId:
                    favorableType === FavorableType.Location
                        ? favorableContextId
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
            setIsFavorite(!!isFavoriteData?.isFavorite)
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
