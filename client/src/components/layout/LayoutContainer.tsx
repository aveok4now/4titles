'use client'

import { useBackground } from '@/contexts/background-context'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useSidebar } from '@/hooks/useSidebar'
import { PropsWithChildren, useEffect } from 'react'
import { cn } from '../../utils/tw-merge'
import FadeContent from '../ui/custom/content/fade-content'

export function LayoutContainer({ children }: PropsWithChildren<unknown>) {
    const isMobile = useMediaQuery('(max-width: 1024px)')

    const { isCollapsed, open, close } = useSidebar()
    const { setBackgroundType } = useBackground()

    useEffect(() => {
        if (isMobile) {
            if (!isCollapsed) close()
        } else {
            if (isCollapsed) open()
        }
    }, [isMobile])

    useEffect(() => {
        setBackgroundType('aurora')
        return () => setBackgroundType('default')
    }, [setBackgroundType])

    return (
        <main
            className={cn(
                'mt-20 flex-1 p-4 lg:p-8',
                isCollapsed ? 'ml-16' : 'ml-16 lg:ml-64',
            )}
        >
            <FadeContent delay={500} blur>
                {children}
            </FadeContent>
        </main>
    )
}
