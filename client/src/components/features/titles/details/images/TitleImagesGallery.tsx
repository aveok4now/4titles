'use client'

import { Button } from '@/components/ui/common/button'
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/common/carousel'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/common/tabs'
import {
    MorphingDialog,
    MorphingDialogClose,
    MorphingDialogContainer,
    MorphingDialogContent,
    MorphingDialogImage,
} from '@/components/ui/custom/content/morphing-dialog'
import { Hint } from '@/components/ui/elements/Hint'
import { TitleImage } from '@/graphql/generated/output'
import { cn } from '@/utils/tw-merge'
import { ChevronLeft, ChevronRight, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface TitleImagesGalleryProps {
    backdrops: TitleImage[]
    posters: TitleImage[]
    logos: TitleImage[]
    locale: string
}

type ImageType = 'backdrops' | 'posters' | 'logos'

export function TitleImagesGallery({
    backdrops,
    posters,
    logos,
    locale,
}: TitleImagesGalleryProps) {
    const t = useTranslations('titleDetails.images')

    const getDefaultTab = (): ImageType => {
        if (backdrops.length > 0) return 'backdrops'
        if (posters.length > 0) return 'posters'
        if (logos.length > 0) return 'logos'
        return 'backdrops'
    }

    const [activeTab, setActiveTab] = useState<ImageType>(getDefaultTab())
    const [backdropApi, setBackdropApi] = useState<CarouselApi>()
    const [posterApi, setPosterApi] = useState<CarouselApi>()
    const [logoApi, setLogoApi] = useState<CarouselApi>()
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const getActiveImages = (): TitleImage[] => {
        switch (activeTab) {
            case 'backdrops':
                return backdrops
            case 'posters':
                return posters
            case 'logos':
                return logos
            default:
                return backdrops
        }
    }

    const activeImages = getActiveImages()

    useEffect(() => {
        setCurrentImageIndex(0)
        setIsDialogOpen(false)
    }, [activeTab])

    const getImageUrl = (
        image: TitleImage | null,
        size: 'thumb' | 'full' = 'thumb',
    ) => {
        if (!image?.file_path) return ''
        return size === 'thumb'
            ? `https://image.tmdb.org/t/p/w300${image.file_path}`
            : `https://image.tmdb.org/t/p/original${image.file_path}`
    }

    const handleNext = () => {
        if (currentImageIndex < activeImages.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1)
        }
    }

    const handlePrev = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1)
        }
    }

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index)
        setIsDialogOpen(true)
    }

    const getImageAspectClass = (type: ImageType): string => {
        switch (type) {
            case 'backdrops':
                return 'aspect-video'
            case 'posters':
                return 'aspect-[2/3]'
            case 'logos':
                return 'aspect-[3/1]'
            default:
                return 'aspect-video'
        }
    }

    const getAvailableTabs = () => {
        const tabs = []
        if (backdrops.length > 0) tabs.push('backdrops')
        if (posters.length > 0) tabs.push('posters')
        if (logos.length > 0) tabs.push('logos')
        return tabs
    }

    const availableTabs = getAvailableTabs()
    const showTabs = availableTabs.length > 1

    return (
        <>
            {showTabs && (
                <Tabs
                    defaultValue={activeTab}
                    value={activeTab}
                    onValueChange={value => setActiveTab(value as ImageType)}
                    className='my-4'
                >
                    <TabsList
                        className={`grid w-full max-w-md grid-cols-${availableTabs.length}`}
                    >
                        {backdrops.length > 0 && (
                            <TabsTrigger value='backdrops'>
                                {t('backdrops')}
                            </TabsTrigger>
                        )}
                        {posters.length > 0 && (
                            <TabsTrigger value='posters'>
                                {t('posters')}
                            </TabsTrigger>
                        )}
                        {logos.length > 0 && (
                            <TabsTrigger value='logos'>
                                {t('logos')}
                            </TabsTrigger>
                        )}
                    </TabsList>
                </Tabs>
            )}

            <div className='relative'>
                <Carousel
                    setApi={
                        activeTab === 'backdrops'
                            ? setBackdropApi
                            : activeTab === 'posters'
                              ? setPosterApi
                              : setLogoApi
                    }
                    opts={{
                        align: 'start',
                        loop: false,
                        dragFree: true,
                    }}
                    className='w-full'
                >
                    <CarouselContent className='cursor-grab'>
                        {activeImages.map((image, index) => (
                            <CarouselItem
                                key={`${image.file_path}-${index}`}
                                className={cn(
                                    'basis-full select-none sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6',
                                )}
                            >
                                <Hint
                                    label={t('clickToView')}
                                    side='bottom'
                                    align='center'
                                >
                                    <div
                                        className={cn(
                                            'h-full w-full cursor-pointer overflow-hidden rounded-lg border border-card transition-all hover:scale-95 hover:border-primary',
                                            getImageAspectClass(activeTab),
                                        )}
                                        onClick={() => handleImageClick(index)}
                                    >
                                        <Image
                                            src={getImageUrl(image)}
                                            alt={t('imageAlt')}
                                            className={cn(
                                                'h-full w-full object-cover',
                                                activeTab === 'logos' &&
                                                    'bg-foreground object-contain dark:bg-transparent',
                                            )}
                                            width={300}
                                            height={
                                                activeTab === 'backdrops'
                                                    ? 169
                                                    : activeTab === 'posters'
                                                      ? 450
                                                      : 100
                                            }
                                        />
                                    </div>
                                </Hint>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {activeImages.length > 5 && (
                        <>
                            <CarouselPrevious className='absolute -left-4 top-1/2 md:-left-5' />
                            <CarouselNext className='absolute -right-4 top-1/2 md:-right-5' />
                        </>
                    )}
                </Carousel>
            </div>

            {activeImages.length > 0 && (
                <MorphingDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    transition={{
                        duration: 0.3,
                        ease: 'easeInOut',
                    }}
                >
                    <MorphingDialogContainer>
                        <MorphingDialogContent className='relative max-h-[90vh] max-w-[90vw] rounded-lg bg-background/90 p-4 backdrop-blur-sm md:max-w-[80vw] lg:max-w-[70vw]'>
                            <div className='flex flex-col items-center'>
                                {activeImages[currentImageIndex] && (
                                    <MorphingDialogImage
                                        src={getImageUrl(
                                            activeImages[currentImageIndex],
                                            'full',
                                        )}
                                        alt={t('imageAlt')}
                                        className={cn(
                                            'max-h-[80vh] select-none object-contain',
                                            activeTab === 'backdrops'
                                                ? 'w-full max-w-full'
                                                : activeTab === 'posters'
                                                  ? 'max-w-[600px]'
                                                  : 'w-full max-w-full',
                                        )}
                                    />
                                )}

                                <div className='mt-4 flex justify-center gap-4'>
                                    <Button
                                        size='icon'
                                        variant='outline'
                                        onClick={handlePrev}
                                        disabled={currentImageIndex === 0}
                                        className={cn(
                                            'rounded-full p-2 transition-colors',
                                            currentImageIndex === 0
                                                ? 'cursor-not-allowed'
                                                : '',
                                        )}
                                    >
                                        <ChevronLeft className='size-5' />
                                    </Button>
                                    <span className='flex items-center text-sm text-muted-foreground'>
                                        {currentImageIndex + 1} /{' '}
                                        {activeImages.length}
                                    </span>
                                    <Button
                                        size='icon'
                                        variant='outline'
                                        onClick={handleNext}
                                        disabled={
                                            currentImageIndex ===
                                            activeImages.length - 1
                                        }
                                        className={cn(
                                            'rounded-full p-2 transition-colors',
                                            currentImageIndex ===
                                                activeImages.length - 1 &&
                                                'cursor-not-allowed',
                                        )}
                                    >
                                        <ChevronRight className='size-5' />
                                    </Button>
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
                            <XIcon className='size-5 text-foreground/80' />
                        </MorphingDialogClose>
                    </MorphingDialogContainer>
                </MorphingDialog>
            )}
        </>
    )
}
