'use client'

import { Flag, MapPinCheck, Settings2Icon, Users2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Route } from '../types/sidebar.types'
import { SidebarItem } from '../ui/SidebarItem'

export function DashboardNav() {
    const t = useTranslations('layout.sidebar.dashboardNav')

    const routes: Route[] = [
        {
            label: t('settings'),
            href: '/dashboard/settings',
            icon: Settings2Icon,
        },
        {
            label: t('followers'),
            href: '/dashboard/followers',
            icon: Users2Icon,
        },
        {
            label: t('filmingLocationProposals'),
            href: '/dashboard/filming-location-proposals',
            icon: MapPinCheck,
        },
        {
            label: t('feedbacks'),
            href: '/dashboard/feedbacks',
            icon: Flag,
        },
    ]

    return (
        <div className='space-y-2 px-2 pt-4 lg:pt-0'>
            {routes.map((route, index) => (
                <SidebarItem key={index} route={route} />
            ))}
        </div>
    )
}
