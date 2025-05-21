'use client'

import { Marquee } from '@/components/ui/custom/content/marquee'
import { useDeviceSize } from '@/hooks/useDeviceSize'
import { useTranslations } from 'next-intl'
import { HomeCollectionCard } from './HomeCollectionCard'

export function HomeCollectionsShowcase() {
    const { isMobile, isTablet, isLaptop } = useDeviceSize()
    const t = useTranslations('home.about.collections.showcase')

    const collections = [
        {
            id: 1,
            title: t('europeAdventure.title'),
            description: t('europeAdventure.description'),
            color: '#4CAF50',
            emoji: '🌍',
        },
        {
            id: 2,
            title: t('best2025.title'),
            description: t('best2025.description'),
            color: '#2196F3',
            emoji: '🏆',
        },
        {
            id: 3,
            title: t('newYorkIcons.title'),
            description: t('newYorkIcons.description'),
            color: '#FF9800',
            emoji: '🗽',
        },
        {
            id: 4,
            title: t('netflixSeries.title'),
            description: t('netflixSeries.description'),
            color: '#F44336',
            emoji: '📺',
        },
        {
            id: 5,
            title: t('historicalDramas.title'),
            description: t('historicalDramas.description'),
            color: '#9C27B0',
            emoji: '📜',
        },
        {
            id: 6,
            title: t('sciFiWonders.title'),
            description: t('sciFiWonders.description'),
            color: '#00BCD4',
            emoji: '🚀',
        },
        {
            id: 7,
            title: t('asianCinema.title'),
            description: t('asianCinema.description'),
            color: '#795548',
            emoji: '🏮',
        },
        {
            id: 8,
            title: t('crimeThriller.title'),
            description: t('crimeThriller.description'),
            color: '#607D8B',
            emoji: '🔍',
        },
        {
            id: 9,
            title: t('familyAdventures.title'),
            description: t('familyAdventures.description'),
            color: '#8BC34A',
            emoji: '👨‍👩‍👧‍👦',
        },
        {
            id: 10,
            title: t('medievalFantasy.title'),
            description: t('medievalFantasy.description'),
            color: '#FF5722',
            emoji: '🏰',
        },
        {
            id: 11,
            title: t('iconicFilms.title'),
            description: t('iconicFilms.description'),
            color: '#3F51B5',
            emoji: '🎭',
        },
        {
            id: 12,
            title: t('hiddenGems.title'),
            description: t('hiddenGems.description'),
            color: '#009688',
            emoji: '💎',
        },
        {
            id: 13,
            title: t('awardWinners.title'),
            description: t('awardWinners.description'),
            color: '#FFC107',
            emoji: '🏅',
        },
        {
            id: 14,
            title: t('cultMovies.title'),
            description: t('cultMovies.description'),
            color: '#E91E63',
            emoji: '🎬',
        },
        {
            id: 15,
            title: t('winterMovies.title'),
            description: t('winterMovies.description'),
            color: '#03A9F4',
            emoji: '❄️',
        },
        {
            id: 16,
            title: t('summerBlockbusters.title'),
            description: t('summerBlockbusters.description'),
            color: '#FF4081',
            emoji: '☀️',
        },
        {
            id: 17,
            title: t('holidayFavorites.title'),
            description: t('holidayFavorites.description'),
            color: '#673AB7',
            emoji: '🎁',
        },
        {
            id: 18,
            title: t('christmasClassics.title'),
            description: t('christmasClassics.description'),
            color: '#C2185B',
            emoji: '🎄',
        },
        {
            id: 19,
            title: t('horrorMarathon.title'),
            description: t('horrorMarathon.description'),
            color: '#424242',
            emoji: '👻',
        },
        {
            id: 20,
            title: t('autumnMovies.title'),
            description: t('autumnMovies.description'),
            color: '#E65100',
            emoji: '🍂',
        },
        {
            id: 21,
            title: t('italianCinema.title'),
            description: t('italianCinema.description'),
            color: '#388E3C',
            emoji: '🇮🇹',
        },
        {
            id: 22,
            title: t('parisFilms.title'),
            description: t('parisFilms.description'),
            color: '#0097A7',
            emoji: '🗼',
        },
        {
            id: 23,
            title: t('scandinavianNoir.title'),
            description: t('scandinavianNoir.description'),
            color: '#7B1FA2',
            emoji: '🇸🇪',
        },
        {
            id: 24,
            title: t('londonFilms.title'),
            description: t('londonFilms.description'),
            color: '#1976D2',
            emoji: '🇬🇧',
        },
        {
            id: 25,
            title: t('japaneseFilms.title'),
            description: t('japaneseFilms.description'),
            color: '#D32F2F',
            emoji: '🇯🇵',
        },
    ]

    const showOneRow = isMobile || isTablet

    const firstColumnCollections = showOneRow
        ? collections
        : collections.slice(0, 8)
    const secondColumnCollections = showOneRow ? [] : collections.slice(8, 16)
    const thirdColumnCollections =
        showOneRow || !isLaptop ? [] : collections.slice(16)

    return (
        <div className='absolute inset-0 overflow-hidden'>
            {showOneRow ? (
                <Marquee pauseOnHover className='[--duration:30s]' repeat={2}>
                    {collections.map(collection => (
                        <HomeCollectionCard
                            key={collection.id}
                            title={collection.title}
                            color={collection.color}
                            description={collection.description}
                            emoji={collection.emoji}
                        />
                    ))}
                </Marquee>
            ) : (
                <div className='flex h-full items-center justify-center px-8'>
                    <div
                        className={`mx-auto grid h-auto max-w-4xl ${isLaptop ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}
                    >
                        <div className='flex h-full flex-col'>
                            <Marquee
                                vertical
                                pauseOnHover
                                className='h-full [--duration:30s]'
                                repeat={2}
                            >
                                {firstColumnCollections.map(collection => (
                                    <HomeCollectionCard
                                        key={collection.id}
                                        title={collection.title}
                                        color={collection.color}
                                        description={collection.description}
                                        emoji={collection.emoji}
                                    />
                                ))}
                            </Marquee>
                        </div>
                        <div className='flex h-full flex-col'>
                            <Marquee
                                vertical
                                reverse
                                pauseOnHover
                                className='h-full [--duration:35s]'
                                repeat={2}
                            >
                                {secondColumnCollections.map(collection => (
                                    <HomeCollectionCard
                                        key={collection.id}
                                        title={collection.title}
                                        color={collection.color}
                                        description={collection.description}
                                        emoji={collection.emoji}
                                    />
                                ))}
                            </Marquee>
                        </div>
                        {isLaptop && (
                            <div className='flex h-full flex-col'>
                                <Marquee
                                    vertical
                                    pauseOnHover
                                    className='h-full [--duration:32s]'
                                    repeat={2}
                                >
                                    {thirdColumnCollections.map(collection => (
                                        <HomeCollectionCard
                                            key={collection.id}
                                            title={collection.title}
                                            color={collection.color}
                                            description={collection.description}
                                            emoji={collection.emoji}
                                        />
                                    ))}
                                </Marquee>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className='pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background to-transparent'></div>
            <div className='pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background to-transparent'></div>
            <div className='pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent'></div>
            <div className='pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent'></div>
            <div className='absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20'></div>
        </div>
    )
}
