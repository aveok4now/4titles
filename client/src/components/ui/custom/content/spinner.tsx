'use client'

import { cn } from '@/utils/tw-merge'

interface SpinnerProps {
    className?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    color?: string
}

export function Spinner({ className, size = 'md', color }: SpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
        xl: 'h-8 w-8',
    }

    const colorClasses = color || 'border-primary-foreground'

    return (
        <div
            className={cn(
                `animate-spin rounded-full border-b-2 border-t-2 ${colorClasses}`,
                sizeClasses[size],
                className,
            )}
        />
    )
}
