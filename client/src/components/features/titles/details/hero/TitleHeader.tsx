'use client'

import FadeContent from '@/components/ui/custom/content/fade-content'
import { TextGenerateEffect } from '@/components/ui/custom/text/text-generate-effect'
import { Heading } from '@/components/ui/elements/Heading'

interface TitleHeaderProps {
    name: string
    releaseYear?: number
    tagline?: string
}

export function TitleHeader({ name, releaseYear, tagline }: TitleHeaderProps) {
    return (
        <FadeContent delay={100} duration={1500}>
            <div className='flex flex-col items-start gap-x-0 md:flex-row md:items-center md:gap-x-2'>
                <Heading size='lg' title={name} />
                {releaseYear && (
                    <span className='text-4xl text-muted-foreground/75'>
                        ({releaseYear})
                    </span>
                )}
            </div>
            {tagline && (
                <TextGenerateEffect
                    words={tagline}
                    className='mt-2'
                    textClassName='font-medium italic text-foreground/80'
                />
            )}
        </FadeContent>
    )
}
