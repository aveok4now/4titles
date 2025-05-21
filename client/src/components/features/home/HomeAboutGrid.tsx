'use client'

import {
    CollectionType,
    type FindTitlesQuery,
} from '@/graphql/generated/output'

import { BentoCard, BentoGrid } from '@/components/ui/custom/content/bento-grid'
import {
    BellIcon,
    ClapperboardIcon,
    MapPinnedIcon,
    ShapesIcon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { HomeCollectionsShowcase } from './HomeCollectionsShowcase'
import { HomeFilmingLocationsGlobe } from './HomeFilmingLocationsGlobe'
import { HomeNotificationsList } from './HomeNotificationsList'
import { HomeTitlesShowcase } from './HomeTitlesShowcase'

interface HomeAboutGridProps {
    titles?: FindTitlesQuery['findTitles']
}

export function HomeAboutGrid({ titles = [] }: HomeAboutGridProps) {
    const t = useTranslations('home.about')

    const features = [
        {
            Icon: ClapperboardIcon,
            name: t('titles.heading'),
            description: t('titles.description'),
            href: '/titles',
            cta: t('titles.cta'),
            className: 'col-span-3 lg:col-span-1',
            background: <HomeTitlesShowcase titles={titles} />,
        },
        {
            Icon: MapPinnedIcon,
            name: t('filmingLocations.heading'),
            description: t('filmingLocations.description'),
            href: `/collections?type=${CollectionType.Location}`,
            cta: t('filmingLocations.cta'),
            className: 'col-span-3 lg:col-span-2',
            background: <HomeFilmingLocationsGlobe locations={[]} />,
        },
        {
            Icon: ShapesIcon,
            name: t('collections.heading'),
            description: t('collections.description'),
            href: '/collections',
            cta: t('collections.cta'),
            className: 'col-span-3 lg:col-span-2',
            background: <HomeCollectionsShowcase />,
        },
        {
            Icon: BellIcon,
            name: t('notifications.heading'),
            description: t('notifications.description'),
            href: '/dashboard/settings',
            cta: t('notifications.cta'),
            className: 'col-span-3 lg:col-span-1',
            background: <HomeNotificationsList />,
        },
    ]

    return (
        <BentoGrid>
            {features.map((feature, idx) => (
                <BentoCard key={idx} {...feature} />
            ))}
        </BentoGrid>
    )
}
