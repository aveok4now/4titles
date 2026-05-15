'use client'

import { cn } from '@/utils/tw-merge'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

interface CircularProgressProps {
    value: number
    size?: number
    strokeWidth?: number
    className?: string
    strokeColor?: string
    textClassName?: string
    backgroundColor?: string
    animated?: boolean
    showValue?: boolean
    suffix?: string
    children?: React.ReactNode
}

export function CircularProgress({
    value,
    size = 64,
    strokeWidth = 4,
    className,
    strokeColor = 'var(--primary)',
    backgroundColor = 'var(--muted)',
    textClassName,
    animated = true,
    showValue = true,
    suffix = '%',
    children,
}: CircularProgressProps) {
    const [animatedValue, setAnimatedValue] = useState(0)

    const radius = (size - strokeWidth) / 2

    const circumference = radius * 2 * Math.PI
    const progress = animated ? animatedValue : value
    const strokeDashoffset = circumference - (progress / 100) * circumference

    const center = size / 2

    useEffect(() => {
        if (animated) {
            setAnimatedValue(0)

            const timer = setTimeout(() => {
                setAnimatedValue(value)
            }, 100)

            return () => clearTimeout(timer)
        }
    }, [value, animated])

    return (
        <div
            className={cn(
                'relative inline-flex items-center justify-center',
                className,
            )}
            style={{ width: size, height: size }}
        >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill='transparent'
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                />

                <motion.circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill='transparent'
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap='round'
                    transform={`rotate(-90 ${center} ${center})`}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: strokeDashoffset }}
                    transition={{
                        duration: animated ? 1.5 : 0,
                        ease: 'easeOut',
                    }}
                />
            </svg>

            <div className='absolute inset-0 flex items-center justify-center'>
                {children ||
                    (showValue && (
                        <div
                            className={cn(
                                'text-sm font-semibold',
                                textClassName,
                            )}
                        >
                            {Math.round(progress)}
                            {suffix && (
                                <span className='ml-0.5 text-xs'>{suffix}</span>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    )
}
