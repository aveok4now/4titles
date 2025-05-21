'use client'

import { cn } from '@/utils/tw-merge'
import { motion, stagger, useAnimate } from 'motion/react'
import { useEffect } from 'react'

export const TextGenerateEffect = ({
    words,
    className,
    textClassName,
    filter = true,
    duration = 0.5,
    highlightWords = [],
}: {
    words: string
    className?: string
    textClassName?: string
    filter?: boolean
    duration?: number
    highlightWords?: string[]
}) => {
    const [scope, animate] = useAnimate()
    let wordsArray = words.split(' ')
    useEffect(() => {
        animate(
            'span',
            {
                opacity: 1,
                filter: filter ? 'blur(0px)' : 'none',
            },
            {
                duration: duration ? duration : 1,
                delay: stagger(0.2),
            },
        )
    }, [scope.current])

    const renderWords = () => {
        return (
            <motion.div ref={scope}>
                {wordsArray.map((word, idx) => {
                    const cleanWord = word.replace(/[,.!?]$/g, '')

                    const shouldHighlight = highlightWords.some(highlight => {
                        if (
                            cleanWord.toLowerCase() === highlight.toLowerCase()
                        ) {
                            return true
                        }

                        const parts = highlight.toLowerCase().split(' ')
                        return parts.includes(cleanWord.toLowerCase())
                    })

                    return (
                        <motion.span
                            key={word + idx}
                            className={`${shouldHighlight && 'text-primary'} opacity-0`}
                            style={{
                                filter: filter ? 'blur(10px)' : 'none',
                            }}
                        >
                            {word}{' '}
                        </motion.span>
                    )
                })}
            </motion.div>
        )
    }

    return (
        <div className={cn('font-bold', className)}>
            <div className='my-4'>
                <div className={cn(textClassName)}>{renderWords()}</div>
            </div>
        </div>
    )
}
