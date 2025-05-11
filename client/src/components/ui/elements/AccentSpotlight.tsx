import { cn } from '@/utils/tw-merge'
import { Spotlight } from '../custom/content/spotlight'

interface AccentSpotlightProps {
    size?: number
    className?: string
}

export function AccentSpotlight({
    size = 300,
    className,
}: AccentSpotlightProps) {
    return (
        <Spotlight
            className={cn(
                'z-10 from-primary/20 via-primary/10 to-transparent blur-2xl',
                className,
            )}
            size={size}
        />
    )
}
