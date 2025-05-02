'use client'

import type { ReactNode } from 'react'

import FadeContent from '@/components/ui/custom/content/fade-content'

import { cn } from '@/utils/tw-merge'

export interface HomeSectionContainterProps {
    children: ReactNode
    className?: string
}

export function HomeSectionContainer({
    children,
    className,
}: HomeSectionContainterProps) {
    return (
        <FadeContent delay={500} blur className={cn('space-y-12', className)}>
            {children}
        </FadeContent>
    )
}
