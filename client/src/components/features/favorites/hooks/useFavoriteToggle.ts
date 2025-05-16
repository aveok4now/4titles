import {
    FavorableType,
    IsFavoriteDocument,
    useAddToFavoritesMutation,
    useIsFavoriteQuery,
    useRemoveFromFavoritesMutation,
} from '@/graphql/generated/output'
import { useAuth } from '@/hooks/useAuth'
import { ApolloCache } from '@apollo/client'
import { useEffect, useState } from 'react'

export function useFavoriteToggle(
    favorableId: string,
    favorableType: FavorableType,
    favorableContextId?: string,
    initialIsFavorite?: boolean,
) {
    const { isAuthenticated } = useAuth()
    const [isFavorite, setIsFavorite] = useState<boolean>(
        initialIsFavorite ?? false,
    )
    const [isLoadingCombined, setIsLoadingCombined] = useState(false)

    const queryInput = {
        favorableType,
        favorableId,
        contextId:
            favorableType === FavorableType.Location
                ? favorableContextId
                : null,
    }

    const {
        data: isFavoriteData,
        loading: isFetchingInitialStatus,
        refetch,
    } = useIsFavoriteQuery({
        variables: {
            input: queryInput,
        },
        skip: !isAuthenticated || initialIsFavorite !== undefined,
        fetchPolicy: 'cache-first',
    })

    const updateIsFavoriteCache = (
        cache: ApolloCache<any>,
        isFavorite: boolean,
    ) => {
        cache.writeQuery({
            query: IsFavoriteDocument,
            variables: { input: queryInput },
            data: { isFavorite },
        })
    }

    const [addToFavorites, { loading: isAdding }] = useAddToFavoritesMutation({
        update(cache, { data }) {
            if (data?.addToFavorites) {
                updateIsFavoriteCache(cache, true)
            }
        },
    })

    const [removeFromFavorites, { loading: isRemoving }] =
        useRemoveFromFavoritesMutation({
            update(cache, { data }) {
                if (data?.removeFromFavorites) {
                    updateIsFavoriteCache(cache, false)
                }
            },
        })

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
        initialIsFavorite !== undefined
            ? initialIsFavorite
            : (isFavoriteData?.isFavorite ?? isFavorite)

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
