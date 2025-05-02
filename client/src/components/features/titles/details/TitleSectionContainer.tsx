'use client'

import FadeContent from '@/components/ui/custom/content/fade-content'
import { Heading } from '@/components/ui/elements/Heading'
import { cn } from '@/utils/tw-merge'
import type { ReactNode } from 'react'

interface TitleSectionContainerProps {
    title?: string
    description?: string
    children: ReactNode
    className?: string
    delay?: number
}

export function TitleSectionContainer({
    title,
    description,
    children,
    className,
    delay,
}: TitleSectionContainerProps) {
    return (
        <section className={cn('container', className)}>
            <FadeContent delay={delay} blur>
                {title ? (
                    <Heading title={title} description={description} />
                ) : null}
                <div className='mt-4'>{children}</div>
            </FadeContent>
        </section>
    )
}
