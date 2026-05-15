'use client'

import { Hint } from '@/components/ui/elements/Hint'
import { formatDate } from '@/utils/format-date'
import { CalendarIcon, ClockIcon } from 'lucide-react'

interface TitleReleaseInfoProps {
    releaseDate?: Date | null
    runtime?: number | null
    t: (key: string) => string
}

export function TitleReleaseInfo({
    releaseDate,
    runtime,
    t,
}: TitleReleaseInfoProps) {
    const formattedReleaseDate = releaseDate ? formatDate(releaseDate) : null

    return (
        <div className='flex flex-wrap items-center gap-4'>
            {formattedReleaseDate && (
                <div className='flex items-center gap-2 text-sm'>
                    <Hint label={t('releaseDate')} side='bottom' align='start'>
                        <CalendarIcon className='h-4 w-4 text-muted-foreground' />
                    </Hint>
                    <span className='text-foreground/80'>
                        {formattedReleaseDate}
                    </span>
                </div>
            )}
            {runtime && (
                <div className='flex items-center gap-2 text-sm'>
                    <Hint label={t('runtime')} side='bottom' align='start'>
                        <ClockIcon className='h-4 w-4 text-muted-foreground' />
                    </Hint>
                    <span className='text-foreground/80'>
                        {runtime} {t('min')}
                    </span>
                </div>
            )}
        </div>
    )
}
