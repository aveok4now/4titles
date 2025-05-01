'use client'

import FadeContent from '@/components/ui/custom/content/fade-content'
import { Heading } from '@/components/ui/elements/Heading'

interface TitleOverviewProps {
    overview?: string
    t: (key: string) => string
}

export function TitleOverview({ overview, t }: TitleOverviewProps) {
    return overview ? (
        <div className='mt-8'>
            <Heading title={t('overview')} size='sm' />
            <FadeContent delay={300}>
                <p className='mt-2 max-w-3xl text-foreground/80'>{overview}</p>
            </FadeContent>
        </div>
    ) : null
}
