'use client'

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/common/avatar'
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/common/carousel'
import {
    MorphingDialog,
    MorphingDialogClose,
    MorphingDialogContainer,
    MorphingDialogContent,
    MorphingDialogImage,
    MorphingDialogTrigger,
} from '@/components/ui/custom/content/morphing-dialog'
import { Heading } from '@/components/ui/elements/Heading'
import { Hint } from '@/components/ui/elements/Hint'
import { TitleCredits } from '@/graphql/generated/output'
import { useTwBreakPoints } from '@/hooks/useTwBreakpoints'
import { DEFAULT_LANGUAGE } from '@/libs/i18n/config'
import { cn } from '@/utils/tw-merge'
import { XIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

interface CastCarouselProps {
    cast: TitleCredits['cast']
}

export function CastCarousel({ cast }: CastCarouselProps) {
    const t = useTranslations('titleDetails.cast')
    const locale = useLocale()

    const breakpoints = useTwBreakPoints()

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [isPrevDisabled, setIsPrevDisabled] = useState(true)
    const [isNextDisabled, setIsNextDisabled] = useState(false)
    const [visibleItems, setVisibleItems] = useState(8)

    useEffect(() => {
        if (breakpoints.is2xl) setVisibleItems(8)
        else if (breakpoints.isXl) setVisibleItems(6)
        else if (breakpoints.isLg) setVisibleItems(5)
        else if (breakpoints.isMd) setVisibleItems(4)
        else if (breakpoints.isSm) setVisibleItems(3)
        else if (breakpoints.isXs) setVisibleItems(2)
    }, [breakpoints])

    useEffect(() => {
        if (typeof window === 'undefined' || !api) return

        const onSelect = () => {
            const currentIndex = api.selectedScrollSnap()
            setCurrent(currentIndex)
            setIsPrevDisabled(currentIndex === 0)
            setIsNextDisabled(
                currentIndex + visibleItems >= api.scrollSnapList().length,
            )
        }

        api.on('select', onSelect)
        onSelect()

        return () => {
            api.off('select', onSelect)
        }
    }, [api, visibleItems])

    const handlePrevClick = useCallback(() => {
        if (!api) return
        const targetIndex = Math.max(0, current - visibleItems)
        api.scrollTo(targetIndex)
    }, [api, current, visibleItems])

    const handleNextClick = useCallback(() => {
        if (!api) return
        const targetIndex = current + visibleItems
        api.scrollTo(targetIndex)
    }, [api, current, visibleItems])

    if (!cast?.length) return null

    return (
        <div className='container'>
            <Heading title={t('heading')} />

            <div className='relative mt-6'>
                <Carousel
                    setApi={setApi}
                    opts={{
                        align: 'start',
                        loop: false,
                        containScroll: 'trimSnaps',
                        dragFree: true,
                    }}
                    className='w-full'
                >
                    <CarouselContent className='cursor-grab'>
                        {cast.map((actor, index) => {
                            const actorName =
                                locale === DEFAULT_LANGUAGE
                                    ? actor.name || actor.original_name
                                    : actor.original_name || actor.name

                            return (
                                <CarouselItem
                                    key={`${actor.name}-${index}`}
                                    className='2xl:basis-1/10 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6'
                                >
                                    <div className='flex flex-col items-center space-y-3'>
                                        {actor.profile_path ? (
                                            <MorphingDialog
                                                transition={{
                                                    duration: 0.3,
                                                    ease: 'easeInOut',
                                                }}
                                            >
                                                <MorphingDialogTrigger className='relative'>
                                                    <Hint
                                                        label={t(
                                                            'viewDialog.triggerHint',
                                                        )}
                                                        side='bottom'
                                                        align='center'
                                                    >
                                                        <Avatar className='relative size-24 overflow-hidden rounded-full'>
                                                            <AvatarImage
                                                                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                                                alt={
                                                                    actorName ||
                                                                    ''
                                                                }
                                                                className='pointer-events-none select-none object-cover'
                                                            />
                                                        </Avatar>
                                                    </Hint>
                                                </MorphingDialogTrigger>

                                                <MorphingDialogContainer>
                                                    <MorphingDialogContent className='relative max-h-[90vh] max-w-[80vw] rounded-lg bg-background/90 p-8 backdrop-blur-sm md:max-w-[60vw]'>
                                                        <div className='flex flex-col items-center gap-6 md:flex-row'>
                                                            <MorphingDialogImage
                                                                src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                                                                alt={
                                                                    actorName ||
                                                                    ''
                                                                }
                                                                className='h-auto w-full max-w-xs rounded-lg object-cover shadow-lg'
                                                            />
                                                            <div className='space-y-4'>
                                                                <h2 className='text-2xl font-bold'>
                                                                    {actorName}
                                                                </h2>
                                                                {actor.character && (
                                                                    <div>
                                                                        <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                                                                            {t(
                                                                                'viewDialog.character',
                                                                            )}
                                                                        </h3>
                                                                        <p className='text-lg text-foreground'>
                                                                            {
                                                                                actor.character
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </MorphingDialogContent>

                                                    <MorphingDialogClose
                                                        className='fixed right-6 top-6 h-fit w-fit rounded-full bg-background/80 p-2 shadow-sm backdrop-blur-sm'
                                                        variants={{
                                                            initial: {
                                                                opacity: 0,
                                                            },
                                                            animate: {
                                                                opacity: 1,
                                                                transition: {
                                                                    delay: 0.2,
                                                                    duration: 0.2,
                                                                },
                                                            },
                                                            exit: {
                                                                opacity: 0,
                                                                transition: {
                                                                    duration: 0.1,
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <XIcon className='h-5 w-5 text-foreground/80' />
                                                    </MorphingDialogClose>
                                                </MorphingDialogContainer>
                                            </MorphingDialog>
                                        ) : (
                                            <Avatar className='relative size-24 overflow-hidden rounded-full'>
                                                <AvatarFallback>
                                                    {actorName?.[0] || '?'}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}

                                        <div className='space-y-1 text-center'>
                                            <p className='select-none text-sm font-medium leading-none text-foreground'>
                                                {actorName}
                                            </p>
                                            {actor.character && (
                                                <p className='select-none text-xs text-muted-foreground'>
                                                    {actor.character}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CarouselItem>
                            )
                        })}
                    </CarouselContent>
                    <div className='mt-2'>
                        <CarouselPrevious
                            className={cn(
                                'absolute -left-0 top-1/3 md:-left-4',
                                isPrevDisabled ? 'hidden' : 'flex',
                            )}
                            onClick={e => {
                                e.preventDefault()
                                handlePrevClick()
                            }}
                        />
                        <CarouselNext
                            className={cn(
                                'absolute -right-0 top-1/3 md:-right-4',
                                isNextDisabled ? 'hidden' : 'flex',
                            )}
                            onClick={e => {
                                e.preventDefault()
                                handleNextClick()
                            }}
                        />
                    </div>
                </Carousel>
            </div>
        </div>
    )
}
