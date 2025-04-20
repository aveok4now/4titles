import {
    AnimatePresence,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from 'motion/react'
import { PropsWithChildren, useState } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../common/tooltip'

interface HintProps {
    label: string
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
    const [isHovered, setIsHovered] = useState(false)

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

    if (!animated) {
        return (
            <TooltipProvider>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild={asChild}>
                        {children}
                    </TooltipTrigger>
                    <TooltipContent
                        className='bg-popover text-popover-foreground'
                        side={side}
                        align={align}
                    >
                        <p className='font-semibold'>{label}</p>
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

    const getPositionClass = () => {
        let positionClass = ''
        let originClass = ''

        switch (side) {
            case 'top':
                positionClass = 'bottom-full mb-2'
                break
            case 'bottom':
                positionClass = 'top-full mt-2'
                break
            case 'left':
                positionClass = 'right-full mr-2'
                break
            case 'right':
                positionClass = 'left-full ml-2'
                break
        }

        if (side === 'top' || side === 'bottom') {
            switch (align) {
                case 'start':
                    originClass =
                        side === 'top'
                            ? 'origin-bottom-left'
                            : 'origin-top-left'
                    break
                case 'end':
                    originClass =
                        side === 'top'
                            ? 'origin-bottom-right'
                            : 'origin-top-right'
                    break
                default:
                    originClass =
                        side === 'top'
                            ? 'origin-bottom left-1/2 -translate-x-1/2'
                            : 'origin-top left-1/2 -translate-x-1/2'
            }
        } else {
            switch (align) {
                case 'start':
                    originClass =
                        side === 'left' ? 'origin-top-right' : 'origin-top-left'
                    break
                case 'end':
                    originClass =
                        side === 'left'
                            ? 'origin-bottom-right'
                            : 'origin-bottom-left'
                    break
                default:
                    originClass =
                        side === 'left'
                            ? 'origin-right top-1/2 -translate-y-1/2'
                            : 'origin-left top-1/2 -translate-y-1/2'
            }
        }

        return `${positionClass} ${originClass}`
    }

    const animationProps = getAnimationProps()

    return (
        <TooltipProvider>
            <div
                className='relative inline-block'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={handleMouseMove}
            >
                {children}
                <AnimatePresence>
                    {isHovered && (
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
                                translateX: translateX,
                                rotate: rotate,
                                whiteSpace: 'nowrap',
                            }}
                            className={`absolute z-50 overflow-hidden rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md ${getPositionClass()}`}
                        >
                            {renderGradients()}
                            <p className='font-semibold'>{label}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </TooltipProvider>
    )
}
