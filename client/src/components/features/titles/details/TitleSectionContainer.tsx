'use client'

import { cn } from '@/utils/tw-merge'
import type { ReactNode } from 'react'

import FadeContent from '@/components/ui/custom/content/fade-content'
import { Heading } from '@/components/ui/elements/Heading'

interface TitleSectionContainerProps {
    title?: string
    description?: string
    children: ReactNode
    className?: string
    delay?: number
    action?: ReactNode
}

export function TitleSectionContainer({
    title,
    description,
    children,
    className,
    delay,
    action,
}: TitleSectionContainerProps) {
    return (
        <section className={cn('container', className)}>
            <FadeContent delay={delay} blur>
                <div className='flex flex-col items-start gap-2 md:flex-row md:items-end md:justify-between'>
                    {title && (
                        <Heading title={title} description={description} />
                    )}
                    {action && <>{action}</>}
                </div>
                <div className='mt-4'>{children}</div>
            </FadeContent>
        </section>
    )
}
