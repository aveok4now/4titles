'use client'

import React, { memo } from 'react'

interface AuroraTextProps {
    children: React.ReactNode
    className?: string
    colors?: string[]
    speed?: number
    variant?: 'default' | 'subtle' | 'vibrant' | 'accent'
}

export const AuroraText = memo(
    ({
        children,
        className = '',
        colors,
        speed = 1,
        variant = 'default',
    }: AuroraTextProps) => {
        const gradientVariants = {
            default: [
                'hsl(var(--primary))',
                'hsl(var(--secondary))',
                'hsl(var(--primary))',
                'hsl(var(--secondary) / 0.8)',
            ],
            subtle: [
                'hsl(var(--primary) / 0.8)',
                'hsl(var(--secondary) / 0.7)',
                'hsl(var(--accent) / 0.6)',
                'hsl(var(--chart-4) / 0.7)',
            ],
            vibrant: [
                'hsl(var(--primary))',
                'hsl(var(--accent))',
                'hsl(var(--chart-1))',
                'hsl(var(--chart-3))',
            ],
            accent: [
                'hsl(var(--accent))',
                'hsl(var(--primary))',
                'hsl(var(--chart-2))',
                'hsl(var(--accent))',
            ],
        }

        const selectedColors = colors || gradientVariants[variant]

        const gradientStyle = {
            backgroundImage: `linear-gradient(135deg, ${selectedColors.join(', ')}, ${
                selectedColors[0]
            })`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animationDuration: `${10 / speed}s`,
        }

        return (
            <span className={`relative inline-block ${className}`}>
                <span className='sr-only'>{children}</span>
                <span
                    className='relative animate-aurora bg-[length:200%_auto] bg-clip-text text-transparent'
                    style={gradientStyle}
                    aria-hidden='true'
                >
                    {children}
                </span>
            </span>
        )
    },
)
