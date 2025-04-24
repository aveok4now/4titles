import type { LucideIcon } from 'lucide-react'
import type { PropsWithChildren, ReactNode } from 'react'
import type { IconType } from 'react-icons'

import ShinyText from '../custom/text/shiny-text'
import { BeamAnimatedCard } from './BeamAnimatedCard'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/tw-merge'

interface CardContainerProps {
    heading: string
    description?: string
    Icon?: LucideIcon | IconType
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
        <BeamAnimatedCard>
            <div
                className={cn(
                    'flex',
                    isSmallScreen ? 'flex-col' : 'items-center justify-between',
                )}
            >
                <div className='flex flex-row items-center gap-x-4'>
                    {Icon && (
                        <div className='rounded-full bg-background p-2.5'>
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
        </BeamAnimatedCard>
    )
}
