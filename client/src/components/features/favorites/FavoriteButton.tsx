'use client'

import { Button, ButtonProps } from '@/components/ui/common/button'
import FadeContent from '@/components/ui/custom/content/fade-content'
import { FavoriteType } from '@/graphql/generated/output'
import { cn } from '@/utils/tw-merge'
import { Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { memo, useCallback } from 'react'
import { toast } from 'sonner'
import { useFavoriteToggle } from './hooks/useFavoriteToggle'

interface FavoriteButtonProps extends Omit<ButtonProps, 'onClick'> {
    entityId: string
    entityRelationId?: string
    entityType: FavoriteType
    initialIsFavorite?: boolean
    onSuccess?: (isFavorite: boolean) => void
}

export const FavoriteButton = memo(
    ({
        entityId,
        entityRelationId,
        entityType,
        initialIsFavorite,
        className,
        size = 'icon',
        variant = 'ghost',
        onSuccess,
    }: FavoriteButtonProps) => {
        const t = useTranslations('components.favoriteButton')
        const {
            isFavorite,
            isLoading,
            isFetchingInitialStatus,
            isAuthenticated,
            refetch,
            addToFavorites,
            removeFromFavorites,
            setIsFavorite,
            setIsLoading,
        } = useFavoriteToggle(
            entityId,
            entityType,
            initialIsFavorite,
            entityRelationId,
        )

        const handleToggleFavorite = useCallback(async () => {
            if (!isAuthenticated) {
                toast.error(t('loginRequired'))
                return
            }

            if (isFavorite === undefined) return

            setIsLoading(true)
            const newState = !isFavorite
            setIsFavorite(newState)
            onSuccess?.(newState)

            try {
                if (isFavorite) {
                    const { data } = await removeFromFavorites({
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
                    })
                    if (data?.removeFromFavorites) {
                        toast.success(
                            t(
                                entityType === FavoriteType.Title
                                    ? 'titleRemoved'
                                    : 'locationRemoved',
                            ),
                        )
                        refetch?.()
                    }
                } else {
                    const { data } = await addToFavorites({
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
                    })
                    if (data?.addToFavorites) {
                        toast.success(
                            t(
                                entityType === FavoriteType.Title
                                    ? 'titleAdded'
                                    : 'locationAdded',
                            ),
                        )
                        refetch?.()
                    }
                }
            } catch {
                toast.error(t('error'))
            } finally {
                setIsLoading(false)
            }
        }, [
            isAuthenticated,
            isFavorite,
            entityId,
            entityType,
            t,
            onSuccess,
            addToFavorites,
            removeFromFavorites,
            refetch,
        ])

        const isDisabled = isLoading || isFavorite === undefined

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

FavoriteButton.displayName = 'FavoriteButton'
