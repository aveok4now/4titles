'use client'

import { cn } from '@/utils/tw-merge'
import { Card } from '../common/card'
import { BorderBeam } from '../custom/content/border-beam'
import { MagicCard } from '../custom/content/magic-card'

interface BeamAnimatedCardProps {
    children: React.ReactNode
    className?: string
    magicCardClassName?: string
}

export const BeamAnimatedCard = ({
    children,
    className,
    magicCardClassName,
}: BeamAnimatedCardProps) => {
    return (
        <Card className={cn('relative overflow-hidden bg-card/90', className)}>
            <MagicCard className={cn('p-4', magicCardClassName)}>
                {children}
            </MagicCard>
            <BorderBeam
                size={300}
                duration={10}
                className='from-transparent via-primary to-transparent opacity-20'
                reverse
            />
            <BorderBeam
                delay={3}
                size={300}
                duration={15}
                className='from-transparent via-primary to-transparent opacity-15'
                reverse
            />
        </Card>
    )
}
