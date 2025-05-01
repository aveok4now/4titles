'use client'

import { CircularProgress } from '@/components/ui/custom/content/circular-progress'
import CountUp from '@/components/ui/custom/text/count-up'
import { Hint } from '@/components/ui/elements/Hint'

interface TitleScoresProps {
    voteAverage: number
    popularity?: number
    t: (key: string) => string
}

export function TitleScores({ voteAverage, popularity, t }: TitleScoresProps) {
    return (
        <div className='flex w-full flex-row gap-x-2'>
            {voteAverage > 0 && (
                <div className='flex items-center gap-2'>
                    <CircularProgress
                        value={voteAverage * 10}
                        size={56}
                        strokeWidth={3}
                        strokeColor='hsl(var(--primary))'
                        backgroundColor='hsl(var(--muted))'
                        className='rounded-full bg-background/80 shadow-sm'
                    >
                        <CountUp
                            to={voteAverage * 10}
                            className='text-sm font-bold'
                            duration={1.5}
                            separator=''
                        />
                        <span className='text-xs'>%</span>
                    </CircularProgress>
                    <span className='truncate text-sm text-foreground/80'>
                        {t('userScore')}
                    </span>
                </div>
            )}
            {popularity && popularity > 0 && (
                <div className='flex items-center gap-2 truncate'>
                    <CircularProgress
                        value={Math.min(100, (popularity / 300) * 100)}
                        size={56}
                        strokeWidth={3}
                        strokeColor='hsl(var(--secondary))'
                        backgroundColor='hsl(var(--muted))'
                        className='rounded-full bg-background/80 shadow-sm'
                    >
                        <Hint
                            label={`${popularity.toFixed(1)} ${t('popularityPoints')}`}
                            side='bottom'
                            align='start'
                        >
                            <CountUp
                                to={Math.min(100, (popularity / 300) * 100)}
                                className='text-sm font-bold'
                                duration={1.5}
                                separator=''
                            />
                            <span className='text-xs'>%</span>
                        </Hint>
                    </CircularProgress>
                    <span className='truncate text-sm text-foreground/80'>
                        {t('popularity')}
                    </span>
                </div>
            )}
        </div>
    )
}
