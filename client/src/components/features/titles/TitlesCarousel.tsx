'use client'

import { useSlidesToScroll } from '@/components/features/titles/hooks/useSlidesToScroll'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '@/components/ui/common/carousel'
import { FindTitlesQuery, Title } from '@/graphql/generated/output'
import { getTitleBackdropUrl } from '@/utils/title/title-localization'
import { cn } from '@/utils/tw-merge'
import Autoplay from 'embla-carousel-autoplay'
import { useLocale } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { TitleBackdropCard } from './TitleBackdropCard'

interface TitlesCarouselProps {
    titles: FindTitlesQuery['findTitles']
    className?: string
}

export function TitlesCarousel({ titles, className }: TitlesCarouselProps) {
    const locale = useLocale()

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
                        return (
                            <CarouselItem
                                key={title.tmdbId}
                                className='select-none pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3 xl:basis-1/5'
                            >
                                <TitleBackdropCard
                                    key={title.id}
                                    title={title}
                                />
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
            </Carousel>
        </div>
    )
}
