'use client'

import { Badge } from '@/components/ui/common/badge'
import { Skeleton } from '@/components/ui/common/skeleton'
import { Tilt } from '@/components/ui/custom/content/tilt'
import { AccentSpotlight } from '@/components/ui/elements/AccentSpotlight'
import { Heading } from '@/components/ui/elements/Heading'
import { LogoImage } from '@/components/ui/elements/LogoImage'
import { ProfileAvatar } from '@/components/ui/elements/ProfileAvatar'
import {
    Collection,
    CollectionType,
    FavorableType,
} from '@/graphql/generated/output'
import { DEFAULT_LANGUAGE } from '@/libs/i18n/config'
import { formatTimeAgo } from '@/utils/date/format-time-ago'
import { getMediaSource } from '@/utils/get-media-source'
import { cn } from '@/utils/tw-merge'
import { Boxes, MessageCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import NextLink from 'next/link'
import { FavoriteButton } from '../favorites'

interface CollectionCardProps {
    collection: Collection
    className?: string
    initialIsFavorite?: boolean
    locale?: string
    onFavoriteChange?: (isFavorite: boolean) => void
}

export function CollectionCard({
    collection,
    className,
    initialIsFavorite,
    locale = DEFAULT_LANGUAGE,
    onFavoriteChange,
}: CollectionCardProps) {
    const t = useTranslations('collections.card')

    const {
        id,
        slug,
        title,
        description,
        coverImage,
        user,
        type,
        createdAt,
        itemsCount,
        favoritesCount,
        commentsCount,
    } = collection

    const collectionUrl = `/collections/${slug}`

    const handleFavoriteChange = (newStatus: boolean) => {
        if (onFavoriteChange) {
            onFavoriteChange(newStatus)
        }
    }

    return (
        <div className={cn('h-full w-full', className)}>
            <div className='relative h-full w-full'>
                <div className='absolute -bottom-1 -right-1 h-[98%] w-[98%] rounded-lg border-2 border-primary/5 bg-card/60 shadow-sm' />
                <div className='absolute -bottom-2 -right-2 h-[96%] w-[96%] rounded-lg border-2 border-primary/5 bg-card/30 shadow-sm' />

                <div className='group relative h-full w-full overflow-visible'>
                    <Tilt
                        className='relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-lg border bg-card shadow-md transition-all duration-300 hover:border-primary/50 hover:shadow-md'
                        style={{
                            transformOrigin: 'center',
                        }}
                        rotationFactor={3}
                        springOptions={{
                            stiffness: 300,
                            damping: 30,
                        }}
                    >
                        <AccentSpotlight />

                        <div
                            className='absolute right-2 top-2 z-20'
                            onClick={e => {
                                e.stopPropagation()
                            }}
                        >
                            <FavoriteButton
                                favorableId={id}
                                favorableType={FavorableType.Collection}
                                initialIsFavorite={initialIsFavorite}
                                variant='outline'
                                size='icon'
                                onSuccess={handleFavoriteChange}
                            />
                        </div>

                        <div className='flex h-full w-full flex-col'>
                            <NextLink
                                href={collectionUrl}
                                className='relative h-40 w-full overflow-hidden sm:h-48'
                            >
                                {coverImage ? (
                                    <Image
                                        src={getMediaSource(coverImage)}
                                        alt={title}
                                        className='object-cover transition-transform duration-500 group-hover:scale-105'
                                        fill
                                        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                                        priority={false}
                                    />
                                ) : (
                                    <div className='flex h-full w-full items-center justify-center bg-muted/20'>
                                        <LogoImage
                                            width={80}
                                            height={80}
                                            className='opacity-20'
                                        />
                                    </div>
                                )}
                                <div className='absolute inset-0 bg-gradient-to-t from-background/40 via-background/20 to-transparent' />

                                <div className='absolute bottom-2 left-2'>
                                    <Badge
                                        variant={
                                            type === CollectionType.Title
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {type === CollectionType.Title
                                            ? t('badge.title')
                                            : t('badge.location')}
                                    </Badge>
                                </div>
                            </NextLink>

                            <NextLink
                                href={collectionUrl}
                                className='relative flex flex-1 flex-col justify-between p-4'
                            >
                                <div className='z-10'>
                                    <Heading
                                        title={title}
                                        description={description || ''}
                                        size='sm'
                                    />
                                </div>

                                <div className='z-40 mt-3 flex items-center justify-between'>
                                    <div className='flex flex-row items-center gap-2'>
                                        <ProfileAvatar
                                            profile={user}
                                            size='sm'
                                        />

                                        <span className='text-sm'>
                                            {user.username}
                                        </span>
                                    </div>

                                    <div className='flex items-center space-x-3 text-muted-foreground'>
                                        <div className='flex items-center space-x-1'>
                                            <MessageCircle className='size-4' />
                                            <span className='text-xs'>
                                                {commentsCount}
                                            </span>
                                        </div>
                                        <div className='flex items-center space-x-1'>
                                            <Boxes className='size-4' />
                                            <span className='text-xs'>
                                                {itemsCount}
                                            </span>
                                        </div>
                                        <div className='hidden truncate text-xs text-muted-foreground md:block'>
                                            {formatTimeAgo(createdAt, locale)}
                                        </div>
                                    </div>
                                </div>
                            </NextLink>
                        </div>
                    </Tilt>
                </div>
            </div>
        </div>
    )
}

export function CollectionCardSkeleton() {
    return (
        <div className='h-full w-full'>
            <div className='relative h-full w-full'>
                <div className='absolute -bottom-1 -right-1 h-[98%] w-[98%] rounded-lg border-2 border-primary/5 bg-card/60 shadow-sm' />
                <div className='absolute -bottom-2 -right-2 h-[96%] w-[96%] rounded-lg border-2 border-primary/5 bg-card/30 shadow-sm' />

                <div className='group relative h-full w-full'>
                    <div className='relative flex h-full w-full flex-col overflow-hidden rounded-lg border bg-card shadow-md'>
                        <div className='relative h-40 w-full sm:h-48'>
                            <Skeleton className='h-full w-full' />

                            <div className='absolute bottom-2 left-2'>
                                <Skeleton className='h-5 w-16 rounded-full' />
                            </div>

                            <div className='absolute right-2 top-2'>
                                <Skeleton className='h-9 w-9 rounded-md' />
                            </div>
                        </div>

                        <div className='flex flex-1 flex-col justify-between p-4'>
                            <div>
                                <Skeleton className='h-6 w-3/4' />
                                <Skeleton className='mt-2 h-4 w-full' />
                                <Skeleton className='mt-1 h-4 w-2/3' />
                            </div>

                            <div className='mt-3 flex items-center justify-between'>
                                <div className='flex items-center space-x-2'>
                                    <Skeleton className='h-8 w-8 rounded-full' />
                                    <Skeleton className='h-4 w-16' />
                                </div>

                                <div className='flex items-center space-x-3'>
                                    <Skeleton className='h-4 w-10' />
                                    <Skeleton className='h-4 w-10' />
                                    <Skeleton className='hidden h-4 w-20 md:block' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
