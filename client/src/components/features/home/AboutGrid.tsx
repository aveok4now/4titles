'use client'

import { BentoCard, BentoGrid } from '@/components/ui/custom/content/bento-grid'
import { BellIcon, MapPinnedIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FilmingLocationsGlobe } from '../filming-locations/FilmingLocationsGlobe'
import { HomeNotificationsList } from './HomeNotificationsList'

export function AboutGrid() {
    const t = useTranslations('home.about')

    const features = [
        {
            Icon: MapPinnedIcon,
            name: t('filmingLocations.heading'),
            description: t('filmingLocations.description'),
            href: '/filming-locations',
            cta: t('filmingLocations.cta'),
            className: 'col-span-3 lg:col-span-2',
            background: <FilmingLocationsGlobe locations={[]} />,
        },
        {
            Icon: BellIcon,
            name: t('notifications.heading'),
            description: t('notifications.description'),
            href: '/dashboard/settings',
            cta: t('notifications.cta'),
            className: 'col-span-3 lg:col-span-1',
            background: (
                <HomeNotificationsList className='absolute right-2 top-1 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90' />
            ),
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
