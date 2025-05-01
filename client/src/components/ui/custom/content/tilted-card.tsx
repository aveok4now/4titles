import type { SpringOptions } from 'motion/react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import Image from 'next/image'
import { ReactNode, useRef, useState } from 'react'

interface TiltedCardProps {
    image?: {
        src: string
        alt: string
        fill?: boolean
        priority?: boolean
    }
    children?: ReactNode
    captionText?: string
    containerClassName?: string
    imageClassName?: string
    containerHeight?: React.CSSProperties['height']
    containerWidth?: React.CSSProperties['width']
    imageHeight?: React.CSSProperties['height']
    imageWidth?: React.CSSProperties['width']
    scaleOnHover?: number
    rotateAmplitude?: number
    showMobileWarning?: boolean
    showTooltip?: boolean
    overlayContent?: React.ReactNode
    displayOverlayContent?: boolean
}

const springValues: SpringOptions = {
    damping: 30,
    stiffness: 100,
    mass: 2,
}

export default function TiltedCard({
    image,
    children,
    captionText = '',
    containerClassName = '',
    imageClassName = '',
    containerHeight = '300px',
    containerWidth = '100%',
    imageHeight = '300px',
    imageWidth = '300px',
    scaleOnHover = 1.1,
    rotateAmplitude = 14,
    showMobileWarning = false,
    showTooltip = false,
    overlayContent = null,
    displayOverlayContent = false,
}: TiltedCardProps) {
    const ref = useRef<HTMLElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useSpring(useMotionValue(0), springValues)
    const rotateY = useSpring(useMotionValue(0), springValues)
    const scale = useSpring(1, springValues)
    const opacity = useSpring(0)
    const rotateFigcaption = useSpring(0, {
        stiffness: 350,
        damping: 30,
        mass: 1,
    })

    const [lastY, setLastY] = useState(0)

    function handleMouse(e: React.MouseEvent<HTMLElement>) {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const offsetX = e.clientX - rect.left - rect.width / 2
        const offsetY = e.clientY - rect.top - rect.height / 2

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude

        rotateX.set(rotationX)
        rotateY.set(rotationY)

        x.set(e.clientX - rect.left)
        y.set(e.clientY - rect.top)

        const velocityY = offsetY - lastY
        rotateFigcaption.set(-velocityY * 0.6)
        setLastY(offsetY)
    }

    function handleMouseEnter() {
        scale.set(scaleOnHover)
        opacity.set(1)
    }

    function handleMouseLeave() {
        opacity.set(0)
        scale.set(1)
        rotateX.set(0)
        rotateY.set(0)
        rotateFigcaption.set(0)
    }

    return (
        <figure
            ref={ref}
            className={`relative flex h-full w-full flex-col items-center justify-center [perspective:800px] ${containerClassName}`}
            style={{
                height: containerHeight,
                width: containerWidth,
            }}
            onMouseMove={handleMouse}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {showMobileWarning && (
                <div className='absolute top-4 block text-center text-sm sm:hidden'>
                    This effect is not optimized for mobile. Check on desktop.
                </div>
            )}

            <motion.div
                className='relative h-full w-full overflow-hidden rounded-lg [transform-style:preserve-3d]'
                style={{
                    width: imageWidth,
                    height: imageHeight,
                    rotateX,
                    rotateY,
                    scale,
                }}
            >
                {image ? (
                    image.fill ? (
                        <div className='relative h-full w-full'>
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className={`object-cover will-change-transform [transform:translateZ(0)] ${imageClassName}`}
                                priority={image.priority}
                            />
                        </div>
                    ) : (
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={parseInt(String(imageWidth), 10) || 300}
                            height={parseInt(String(imageHeight), 10) || 450}
                            className={`object-cover will-change-transform [transform:translateZ(0)] ${imageClassName}`}
                            priority={image.priority}
                        />
                    )
                ) : (
                    children
                )}

                {displayOverlayContent && overlayContent && (
                    <motion.div className='absolute left-0 top-0 z-[2] will-change-transform [transform:translateZ(30px)]'>
                        {overlayContent}
                    </motion.div>
                )}
            </motion.div>

            {showTooltip && captionText && (
                <motion.figcaption
                    className='pointer-events-none absolute left-0 top-0 z-[3] hidden rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 sm:block'
                    style={{
                        x,
                        y,
                        opacity,
                        rotate: rotateFigcaption,
                    }}
                >
                    {captionText}
                </motion.figcaption>
            )}
        </figure>
    )
}
