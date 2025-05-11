'use client'

import { Skeleton } from '@/components/ui/common/skeleton'
import { Tilt } from '@/components/ui/custom/content/tilt'
import { AccentSpotlight } from '@/components/ui/elements/AccentSpotlight'
import { Hint } from '@/components/ui/elements/Hint'
import { LogoImage } from '@/components/ui/elements/LogoImage'
import { Title } from '@/graphql/generated/output'
import { cn } from '@/utils/tw-merge'
import Image from 'next/image'
import NextLink from 'next/link'
import { useTitleBasicInfo } from './hooks'

interface TitleBackdropCardProps {
    title: Title
    className?: string
}

export function TitleBackdropCard({
    title,
    className,
}: TitleBackdropCardProps) {
    const { name, backdropUrl } = useTitleBasicInfo(title)

    return (
        <div className={cn('group relative w-full', className)}>
            <Tilt
                rotationFactor={5}
                isRevese
                style={{
                    transformOrigin: 'center center',
                }}
                springOptions={{
                    stiffness: 300,
                    damping: 30,
                }}
                className='relative h-full w-full overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-md'
            >
                <AccentSpotlight />

                <Hint side='bottom'>
                    <NextLink
                        href={`/titles/${title.slug}`}
                        className='block h-full w-full'
                    >
                        <div className='relative aspect-[16/9] overflow-hidden'>
                            {backdropUrl ? (
                                <Image
                                    src={backdropUrl}
                                    alt={name}
                                    fill
                                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1600px) 33vw, 25vw'
                                    priority
                                    onError={e => {
                                        e.currentTarget.style.display = 'none'
                                    }}
                                />
                            ) : (
                                <div className='relative aspect-[16/9]'>
                                    <div className='flex h-full w-full items-center justify-center bg-background/50'>
                                        <LogoImage className='size-20' />
                                    </div>
                                </div>
                            )}

                            <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent'></div>

                            <div className='absolute bottom-0 left-0 right-0 p-4'>
                                <h3 className='truncate text-base font-medium text-white md:text-lg'>
                                    {name}
                                </h3>
                            </div>
                        </div>
                    </NextLink>
                </Hint>
            </Tilt>
        </div>
    )
}

export function TitleBackdropCardSkeleton({
    className,
}: {
    className?: string
}) {
    return (
        <div className={cn('group relative w-full', className)}>
            <div className='relative h-full w-full overflow-hidden rounded-lg border border-border bg-card transition-all'>
                <div className='relative aspect-[16/9] overflow-hidden'>
                    <Skeleton className='h-full w-full' />
                    <div className='absolute bottom-0 left-0 right-0 p-4'>
                        <Skeleton className='mb-1 h-5 w-3/4' />
                        <div className='flex items-center gap-2'>
                            <Skeleton className='h-3 w-14' />
                            <Skeleton className='h-3 w-20' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
