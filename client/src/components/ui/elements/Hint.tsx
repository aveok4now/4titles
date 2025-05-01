import {
    AnimatePresence,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from 'motion/react'
import { useTranslations } from 'next-intl'
import { PropsWithChildren, useState } from 'react'
import { createPortal } from 'react-dom'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../common/tooltip'

interface HintProps {
    label?: string
    asChild?: boolean
    side?: 'top' | 'bottom' | 'left' | 'right'
    align?: 'start' | 'center' | 'end'
    animated?: boolean
    animationIntensity?: number
}

export function Hint({
    children,
    label,
    asChild,
    align,
    side = 'top',
    animated = true,
    animationIntensity = 0.7,
}: PropsWithChildren<HintProps>) {
    const t = useTranslations('components.hint')

    const [isHovered, setIsHovered] = useState(false)
    const [elementRect, setElementRect] = useState<DOMRect | null>(null)
    const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(
        null,
    )

    const springConfig = { stiffness: 80, damping: 12 }
    const x = useMotionValue(0)

    const rotate = useSpring(
        useTransform(
            x,
            [-100, 100],
            [-10 * animationIntensity, 10 * animationIntensity],
        ),
        springConfig,
    )
    const translateX = useSpring(
        useTransform(
            x,
            [-100, 100],
            [-10 * animationIntensity, 10 * animationIntensity],
        ),
        springConfig,
    )

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!animated) return
        const halfWidth = event.currentTarget.offsetWidth / 2
        x.set(event.nativeEvent.offsetX - halfWidth)
    }

    const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsHovered(true)
        setElementRect(event.currentTarget.getBoundingClientRect())
    }

    if (!animated) {
        return (
            <TooltipProvider>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild={asChild}>
                        {children}
                    </TooltipTrigger>
                    <TooltipContent
                        className='z-[9999] bg-popover text-popover-foreground'
                        side={side}
                        align={align}
                        sideOffset={5}
                    >
                        <p className='font-semibold'>{label || t('default')}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    const renderGradients = () => {
        switch (side) {
            case 'top':
                return (
                    <>
                        <div className='absolute bottom-0 left-1/2 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary to-transparent' />
                        <div className='absolute bottom-0 left-1/2 h-px w-[30%] -translate-x-1/2 bg-gradient-to-r from-transparent via-secondary to-transparent' />
                    </>
                )
            case 'bottom':
                return (
                    <>
                        <div className='absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary to-transparent' />
                        <div className='absolute left-1/2 top-0 h-px w-[30%] -translate-x-1/2 bg-gradient-to-r from-transparent via-secondary to-transparent' />
                    </>
                )
            case 'left':
                return (
                    <>
                        <div className='absolute right-0 top-1/2 h-[60%] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-primary to-transparent' />
                        <div className='absolute right-0 top-1/2 h-[30%] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-secondary to-transparent' />
                    </>
                )
            case 'right':
                return (
                    <>
                        <div className='absolute left-0 top-1/2 h-[60%] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-primary to-transparent' />
                        <div className='absolute left-0 top-1/2 h-[30%] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-secondary to-transparent' />
                    </>
                )
            default:
                return null
        }
    }

    const getAnimationProps = () => {
        const scale = 0.8 + 0.2 * animationIntensity
        const distance = 10 * animationIntensity

        switch (side) {
            case 'top':
                return {
                    initial: { opacity: 0, y: distance, scale },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: distance, scale },
                }
            case 'bottom':
                return {
                    initial: { opacity: 0, y: -distance, scale },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: -distance, scale },
                }
            case 'left':
                return {
                    initial: { opacity: 0, x: distance, scale },
                    animate: { opacity: 1, x: 0, scale: 1 },
                    exit: { opacity: 0, x: distance, scale },
                }
            case 'right':
                return {
                    initial: { opacity: 0, x: -distance, scale },
                    animate: { opacity: 1, x: 0, scale: 1 },
                    exit: { opacity: 0, x: -distance, scale },
                }
            default:
                return {
                    initial: { opacity: 0, y: distance, scale },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: distance, scale },
                }
        }
    }

    const getPositionStyle = () => {
        if (!elementRect) return {}

        let positionStyle: React.CSSProperties = {
            position: 'fixed',
            zIndex: 9999,
        }

        switch (side) {
            case 'top':
                positionStyle.bottom = window.innerHeight - elementRect.top + 8
                positionStyle.left = elementRect.left + elementRect.width / 2
                positionStyle.transform = 'translateX(-50%)'
                break
            case 'bottom':
                positionStyle.top = elementRect.bottom + 8
                positionStyle.left = elementRect.left + elementRect.width / 2
                positionStyle.transform = 'translateX(-50%)'
                break
            case 'left':
                positionStyle.right = window.innerWidth - elementRect.left + 8
                positionStyle.top = elementRect.top + elementRect.height / 2
                positionStyle.transform = 'translateY(-50%)'
                break
            case 'right':
                positionStyle.left = elementRect.right + 8
                positionStyle.top = elementRect.top + elementRect.height / 2
                positionStyle.transform = 'translateY(-50%)'
                break
        }

        return positionStyle
    }

    const animationProps = getAnimationProps()

    return (
        <div
            ref={setContainerRef}
            className='relative block'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
        >
            {children}
            {typeof document !== 'undefined' &&
                isHovered &&
                containerRef &&
                createPortal(
                    <AnimatePresence>
                        <motion.div
                            initial={animationProps.initial}
                            animate={{
                                ...animationProps.animate,
                                transition: {
                                    type: 'spring',
                                    stiffness: 260,
                                    damping: 20,
                                },
                            }}
                            exit={animationProps.exit}
                            style={{
                                ...getPositionStyle(),
                                translateX: translateX,
                                rotate: rotate,
                                whiteSpace: 'nowrap',
                            }}
                            className='overflow-hidden rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md'
                        >
                            {renderGradients()}
                            <p className='font-semibold'>
                                {label || t('default')}
                            </p>
                        </motion.div>
                    </AnimatePresence>,
                    document.body,
                )}
        </div>
    )
}
