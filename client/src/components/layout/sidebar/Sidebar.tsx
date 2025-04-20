'use client'

import { BorderBeam } from '@/components/ui/custom/content/border-beam'
import { useSidebar } from '@/hooks/useSidebar'
import { cn } from '@/utils/tw-merge'
import { usePathname } from 'next/navigation'
import { DashboardNav, UserNav } from './navigation'
import { SidebarHeader } from './ui/SidebarHeader'

export function Sidebar() {
    const { isCollapsed } = useSidebar()

    const pathname = usePathname()
    const isDashboardPage = pathname.includes('/dashboard')

    return (
        <aside
            className={cn(
                'fixed left-0 z-50 mt-20 flex h-full flex-col border-r border-border bg-card/90 transition-all duration-200 ease-in-out',
                isCollapsed ? 'w-16' : 'w-64',
            )}
        >
            <SidebarHeader />

            {isDashboardPage ? <DashboardNav /> : <UserNav />}

            <BorderBeam
                duration={10}
                size={250}
                reverse
                className='from-transparent via-primary to-transparent opacity-30'
            />
        </aside>
    )
}
