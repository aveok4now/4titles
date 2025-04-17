'use client'

import { motion, useMotionTemplate, useMotionValue } from 'motion/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/utils/tw-merge'

interface MagicCardProps {
    children?: React.ReactNode
    className?: string
    gradientSize?: number
    gradientColor?: string
    gradientOpacity?: number
    gradientFrom?: string
    gradientTo?: string
}

export function MagicCard({
    children,
    className,
    gradientSize = 200,
    gradientColor = '#262626',
    gradientOpacity = 0.8,
    gradientFrom = '#9E7AFF',
    gradientTo = '#FE8BBB',
}: MagicCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const mouseX = useMotionValue(-gradientSize)
    const mouseY = useMotionValue(-gradientSize)

    const [isMounted, setIsMounted] = useState(false)

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (cardRef.current) {
                const { left, top } = cardRef.current.getBoundingClientRect()
                mouseX.set(e.clientX - left)
                mouseY.set(e.clientY - top)
            }
        },
        [mouseX, mouseY],
    )

    const handleMouseOut = useCallback(() => {
        mouseX.set(-gradientSize)
        mouseY.set(-gradientSize)
    }, [mouseX, mouseY, gradientSize])

    const handleMouseEnter = useCallback(() => {
        document.addEventListener('mousemove', handleMouseMove)
    }, [handleMouseMove])

    useEffect(() => {
        setIsMounted(true)

        mouseX.set(-gradientSize)
        mouseY.set(-gradientSize)

        const cardElement = cardRef.current
        if (cardElement) {
            cardElement.addEventListener('mouseenter', handleMouseEnter)
            cardElement.addEventListener('mouseleave', () => {
                document.removeEventListener('mousemove', handleMouseMove)
                handleMouseOut()
            })
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            if (cardElement) {
                cardElement.removeEventListener('mouseenter', handleMouseEnter)
            }
        }
    }, [
        gradientSize,
        mouseX,
        mouseY,
        handleMouseEnter,
        handleMouseMove,
        handleMouseOut,
    ])

    const borderGradient = useMotionTemplate`
        radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
        ${gradientFrom}, 
        ${gradientTo}, 
        var(--border) 100%
        )
    `

    const hoverGradient = useMotionTemplate`
        radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, 
        ${gradientColor}, 
        transparent 100%)
    `

    return (
        <div
            ref={cardRef}
            className={cn('group relative rounded-[inherit]', className)}
        >
            {isMounted ? (
                <>
                    <motion.div
                        className='pointer-events-none absolute inset-0 rounded-[inherit] bg-border duration-300 group-hover:opacity-100'
                        style={{
                            background: borderGradient,
                        }}
                    />
                    <div className='absolute inset-px rounded-[inherit] bg-background' />
                    <motion.div
                        className='pointer-events-none absolute inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100'
                        style={{
                            background: hoverGradient,
                            opacity: gradientOpacity,
                        }}
                    />
                </>
            ) : (
                <>
                    <div className='pointer-events-none absolute inset-0 rounded-[inherit] bg-border' />
                    <div className='absolute inset-px rounded-[inherit] bg-background' />
                    <div className='pointer-events-none absolute inset-px rounded-[inherit]' />
                </>
            )}
            <div className='relative'>{children}</div>
        </div>
    )
}
