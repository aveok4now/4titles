'use client'

import type { FindTitlesQuery, Title } from '@/graphql/generated/output'

import { getTitlePosterUrl } from '@/utils/title/title-localization'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { useMemo } from 'react'

interface HomeTitlesShowcaseProps {
    titles: FindTitlesQuery['findTitles']
}

export function HomeTitlesShowcase({ titles }: HomeTitlesShowcaseProps) {
    const locale = useLocale()

    const posterUrls = useMemo(() => {
        return titles
            .filter(title => getTitlePosterUrl(title as Title, locale))
            .map(title => getTitlePosterUrl(title as Title, locale))
            .slice(0, 12)
    }, [titles, locale])

    if (posterUrls.length === 0) return null

    return (
        <div className='absolute inset-0 overflow-hidden'>
            <div className='grid h-full grid-cols-4 gap-3'>
                {posterUrls.map((url, idx) => (
                    <div
                        key={idx}
                        className='aspect-[2/3] transform overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:z-10 hover:scale-105 hover:shadow-lg'
                    >
                        <Image
                            src={url}
                            alt='Poster'
                            width={150}
                            height={225}
                            className='h-full w-full object-cover'
                        />
                    </div>
                ))}
            </div>
            <div className='absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20'></div>
        </div>
    )
}
