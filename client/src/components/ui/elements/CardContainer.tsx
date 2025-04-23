import type { LucideIcon } from 'lucide-react'
import type { PropsWithChildren, ReactNode } from 'react'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/tw-merge'
import { Card } from '../common/card'
import { MagicCard } from '../custom/content/magic-card'
import ShinyText from '../custom/text/shiny-text'

interface CardContainerProps {
    heading: string
    description?: string
    Icon?: LucideIcon
    isRightContentFull?: boolean
    rightContent?: ReactNode
}

export function CardContainer({
    heading,
    description,
    Icon,
    isRightContentFull,
    rightContent,
    children,
}: PropsWithChildren<CardContainerProps>) {
    const isSmallScreen = useMediaQuery('(max-width: 640px)')

    return (
        <Card className='overflow-hidden'>
            <MagicCard className='p-4'>
                <div
                    className={cn(
                        'flex',
                        isSmallScreen
                            ? 'flex-col'
                            : 'items-center justify-between',
                    )}
                >
                    <div className='flex flex-row items-center gap-x-4'>
                        {Icon && (
                            <div className='rounded-full bg-foreground p-2.5'>
                                <Icon className='size-7 text-secondary' />
                            </div>
                        )}
                        <div className='w-full space-y-1'>
                            <ShinyText
                                className={cn(
                                    'font-semibold tracking-wide text-foreground/85',
                                )}
                                text={heading}
                            />
                            {description && (
                                <p className='mr-2 text-sm text-muted-foreground lg:mr-0'>
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                    {rightContent && (
                        <div
                            className={cn(
                                isSmallScreen ? 'ml-0 mt-3 w-full' : '',
                                isSmallScreen && Icon ? 'ml-11' : '',
                                !isSmallScreen && isRightContentFull
                                    ? 'ml-6 w-full'
                                    : '',
                            )}
                        >
                            {rightContent}
                        </div>
                    )}
                </div>
                {children && <div className='mt-4'>{children}</div>}
            </MagicCard>
        </Card>
    )
}
