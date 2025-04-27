'use client'

import type { ReactNode } from 'react'

import { Button } from '@/components/ui/common/button'
import { Heading } from '@/components/ui/elements/Heading'
import { Link } from '@/components/ui/elements/Link'
import { useTranslations } from 'next-intl'

interface ContentCarouselSectionProps {
    heading?: string
    description?: string
    viewAllHref?: string
    viewAllLabel?: string
    children: ReactNode
    className?: string
}

export function ContentCarouselSection({
    heading,
    description,
    viewAllHref,
    viewAllLabel,
    children,
    className,
}: ContentCarouselSectionProps) {
    const t = useTranslations('components.contentSection')

    return (
        <section className={className}>
            <div className='mb-4 flex flex-col items-center gap-2 md:flex-row md:justify-between'>
                {heading && (
                    <Heading title={heading} description={description} />
                )}
                {viewAllHref && (
                    <Link
                        href={viewAllHref}
                        className='self-start font-medium md:self-end'
                    >
                        <Button variant='outline'>
                            {viewAllLabel || t('viewAll')}
                        </Button>
                    </Link>
                )}
            </div>
            {children}
        </section>
    )
}
