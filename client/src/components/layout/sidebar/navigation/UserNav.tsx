'use client'

import { Separator } from '@/components/ui/common/separator'
import {
    CircleHelp,
    Compass,
    Home,
    Newspaper,
    Route as RouteIcon,
    Star,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Route } from '../types/sidebar.types'
import { SidebarItem } from '../ui/SidebarItem'
import { PopularTitleSearches } from '../ui/widgets/PopularTitleSearches'

export function UserNav() {
    const t = useTranslations('layout.sidebar.userNav')

    const routes: Route[] = [
        {
            label: t('home'),
            href: '/',
            icon: Home,
        },
        {
            label: t('titles'),
            href: '/titles',
            icon: Compass,
        },
        {
            label: t('routes'),
            href: '/routes',
            icon: RouteIcon,
        },
        {
            label: t('favorites'),
            href: '/favorites',
            icon: Star,
        },
        {
            label: t('faq'),
            href: '/faq',
            icon: CircleHelp,
        },
    ]

    return (
        <>
            <div className='space-y-2 px-2 pt-4 lg:pt-0'>
                {routes.map((route, index) => (
                    <SidebarItem key={index} route={route} />
                ))}
                <Separator className='mb-3' />
                <PopularTitleSearches />
            </div>
        </>
    )
}
