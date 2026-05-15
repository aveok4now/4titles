'use client'

import { Button, ButtonProps } from '@/components/ui/common/button'
import FadeContent from '@/components/ui/custom/content/fade-content'
import { FavorableType } from '@/graphql/generated/output'
import { cn } from '@/utils/tw-merge'
import { Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { memo, useCallback } from 'react'
import { toast } from 'sonner'
import { useFavoriteToggle } from './hooks/useFavoriteToggle'

interface FavoriteButtonProps extends Omit<ButtonProps, 'onClick'> {
    favorableId: string
    favorableType: FavorableType
    favorableContextId?: string
    initialIsFavorite?: boolean
    onSuccess?: (isFavorite: boolean) => void
    optimisticResponse?: boolean
}

export const FavoriteButton = memo(
    ({
        favorableId,
        favorableType,
        favorableContextId,
        initialIsFavorite,
        className,
        size = 'icon',
        variant = 'ghost',
        onSuccess,
        optimisticResponse = true,
    }: FavoriteButtonProps) => {
        const t = useTranslations('components.favoriteButton')
        const {
            isFavorite,
            isLoading,
            isFetchingInitialStatus,
            isAuthenticated,
            addToFavorites,
            removeFromFavorites,
            setIsFavorite,
            setIsLoading,
        } = useFavoriteToggle(
            favorableId,
            favorableType,
            favorableContextId,
            initialIsFavorite,
        )

        const handleToggleFavorite = useCallback(async () => {
            if (!isAuthenticated) {
                toast.error(t('loginRequired'))
                return
            }

            const currentFavoriteState = isFavorite ?? false

            setIsLoading(true)

            if (optimisticResponse) {
                const newState = !currentFavoriteState
                setIsFavorite(newState)
                onSuccess?.(newState)
            }

            try {
                if (currentFavoriteState) {
                    const { data } = await removeFromFavorites({
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
                    })
                    if (data?.removeFromFavorites) {
                        toast.success(
                            t(
                                favorableType === FavorableType.Title
                                    ? 'titleRemoved'
                                    : favorableType === FavorableType.Collection
                                      ? 'collectionRemoved'
                                      : 'locationRemoved',
                            ),
                        )

                        if (!optimisticResponse) {
                            setIsFavorite(false)
                            onSuccess?.(false)
                        }
                    }
                } else {
                    const { data } = await addToFavorites({
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
                    })
                    if (data?.addToFavorites) {
                        toast.success(
                            t(
                                favorableType === FavorableType.Title
                                    ? 'titleAdded'
                                    : favorableType === FavorableType.Collection
                                      ? 'collectionAdded'
                                      : 'locationAdded',
                            ),
                        )

                        if (!optimisticResponse) {
                            setIsFavorite(true)
                            onSuccess?.(true)
                        }
                    }
                }
            } catch (error) {
                if (optimisticResponse) {
                    setIsFavorite(currentFavoriteState)
                    onSuccess?.(currentFavoriteState)
                }
                toast.error(t('error'))
            } finally {
                setIsLoading(false)
            }
        }, [
            isAuthenticated,
            isFavorite,
            favorableId,
            favorableType,
            favorableContextId,
            t,
            onSuccess,
            addToFavorites,
            removeFromFavorites,
            optimisticResponse,
            setIsFavorite,
            setIsLoading,
        ])

        const isDisabled = isLoading

        return (
            <Button
                variant={variant}
                size={size}
                className={cn(
                    'relative transition-opacity',
                    className,
                    isFetchingInitialStatus && 'cursor-not-allowed opacity-50',
                )}
                onClick={handleToggleFavorite}
                disabled={isDisabled}
                aria-label={
                    isFavorite ? t('removeFromFavorites') : t('addToFavorites')
                }
            >
                <FadeContent duration={100}>
                    <Star
                        className={cn(
                            'transition-colors duration-200',
                            isFavorite ? 'fill-secondary' : 'fill-transparent',
                            isLoading &&
                                !isFetchingInitialStatus &&
                                'animate-pulse',
                        )}
                    />
                </FadeContent>
            </Button>
        )
    },
)
