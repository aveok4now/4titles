'use client'

import { useSlidesToScroll } from '@/components/features/titles/hooks/useSlidesToScroll'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '@/components/ui/common/carousel'
import { BorderBeam } from '@/components/ui/custom/content/border-beam'
import { Hint } from '@/components/ui/elements/Hint'
import { LogoImage } from '@/components/ui/elements/LogoImage'
import { FindTitlesQuery, Title } from '@/graphql/generated/output'
import {
    getLocalizedTitleName,
    getTitleBackdropUrl,
} from '@/utils/localization/title-localization'
import { cn } from '@/utils/tw-merge'
import Autoplay from 'embla-carousel-autoplay'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

interface TitlesCarouselProps {
    titles: FindTitlesQuery['findTitles']
    className?: string
}

export function TitlesCarousel({ titles, className }: TitlesCarouselProps) {
    const locale = useLocale()
    const router = useRouter()

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    const slidesToScroll = useSlidesToScroll()

    const carouselOptions = useMemo(
        () => ({
            align: 'start' as const,
            loop: true,
            dragFree: true,
            containScroll: 'trimSnaps' as const,
            slidesToScroll,
        }),
        [slidesToScroll],
    )

    const plugins = useMemo(
        () => [
            Autoplay({
                delay: 4000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
                rootNode: emblaRoot => emblaRoot.parentElement,
            }),
        ],
        [],
    )

    useEffect(() => {
        if (!api) return

        api.reInit(carouselOptions)
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        const onSelect = () => {
            setCurrent(api.selectedScrollSnap() + 1)
        }

        api.on('select', onSelect)

        return () => {
            api.off('select', onSelect)
        }
    }, [api, carouselOptions])

    const titlesItems = useMemo(() => {
        if (!titles?.items?.length) return []

        return titles.items.filter(title =>
            getTitleBackdropUrl(title as Title, locale),
        ) as Title[]
    }, [titles?.items, locale])

    if (!titles?.items?.length || titlesItems.length === 0) return null

    const navigateToTitle = (slug?: string | null) => {
        if (slug) {
            router.push(`/titles/${slug}`)
        }
    }

    return (
        <div className={cn('w-full overflow-hidden', className)}>
            <Carousel
                opts={carouselOptions}
                plugins={plugins}
                className='w-full'
                setApi={setApi}
            >
                <CarouselContent className='-ml-2 cursor-grab md:-ml-4'>
                    {titlesItems.map((title, index) => {
                        const titleName = getLocalizedTitleName(title, locale)
                        const backdropUrl = getTitleBackdropUrl(title, locale)
                        const isActive = index === current - 1

                        return (
                            <CarouselItem
                                key={title.tmdbId}
                                className='select-none pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3 xl:basis-1/5'
                            >
                                <Hint side='bottom' align='center'>
                                    <div
                                        onClick={() =>
                                            navigateToTitle(
                                                title.slug || undefined,
                                            )
                                        }
                                        className={cn(
                                            'cursor-pointer overflow-hidden rounded-lg transition-all duration-300',
                                            isActive
                                                ? 'shadow-lg'
                                                : 'opacity-85 hover:opacity-100',
                                        )}
                                    >
                                        <div className='relative aspect-[16/9]'>
                                            {backdropUrl ? (
                                                <Image
                                                    src={backdropUrl}
                                                    alt={titleName}
                                                    fill
                                                    className='select-none object-cover transition-transform duration-300 hover:scale-105'
                                                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1600px) 33vw, 20vw'
                                                    priority={index < 4}
                                                    onError={e => {
                                                        e.currentTarget.style.display =
                                                            'none'
                                                    }}
                                                />
                                            ) : (
                                                <div className='flex h-full w-full items-center justify-center bg-muted'>
                                                    <LogoImage
                                                        width={80}
                                                        height={80}
                                                        className='opacity-50'
                                                    />
                                                </div>
                                            )}
                                            <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent'></div>
                                            <div className='absolute bottom-0 left-0 right-0 p-4'>
                                                <h3 className='select-none truncate text-base font-medium text-white md:text-lg'>
                                                    {titleName}
                                                </h3>
                                            </div>
                                            {isActive && (
                                                <>
                                                    <BorderBeam
                                                        duration={6}
                                                        size={300}
                                                        className='from-transparent via-primary to-transparent opacity-40'
                                                    />
                                                    <BorderBeam
                                                        duration={6}
                                                        delay={3}
                                                        size={300}
                                                        className='from-transparent via-secondary to-transparent opacity-25'
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Hint>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
            </Carousel>
        </div>
    )
}
