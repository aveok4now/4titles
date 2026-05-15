import type { LucideIcon } from 'lucide-react'

import CountUp from '@/components/ui/custom/text/count-up'
import { cn } from '@/utils/tw-merge'

interface ProfileStatisticsCardProps {
    Icon?: LucideIcon
    value: number
    label: string
    color: string
    delay?: number
}

export function ProfileStatisticsCard({
    Icon,
    value,
    label,
    color,
    delay = 0,
}: ProfileStatisticsCardProps) {
    return (
        <div className='relative flex flex-1 flex-col items-center rounded-lg border border-border p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-md'>
            {Icon && (
                <div
                    className={cn(
                        'absolute -top-3 left-1/2 flex h-8 w-8 -translate-x-1/2 scale-100 items-center justify-center rounded-full bg-gradient-to-br transition-transform duration-300 hover:scale-110',
                        color,
                    )}
                >
                    <Icon className='size-4 text-white' />
                </div>
            )}

            <div className='mt-3 flex flex-col items-center'>
                <span className='text-2xl font-bold tracking-tight'>
                    <CountUp to={value} duration={1} delay={delay} />
                </span>
                <span className='mt-1 text-center text-xs text-muted-foreground'>
                    {label}
                </span>
            </div>
        </div>
    )
}
