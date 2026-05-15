'use client'

import Aurora from '@/components/ui/custom/backgrounds/aurora'
import Iridescence from '@/components/ui/custom/backgrounds/iridescence'
import Particles, {
    ParticlesProps,
} from '@/components/ui/custom/backgrounds/particles'
import Squares, {
    SquaresProps,
} from '@/components/ui/custom/backgrounds/squares'
import { BackgroundType, useBackground } from '@/contexts/background-context'
import { cn } from '@/utils/tw-merge'
import { FC, useEffect, useState } from 'react'

type AuroraProps = {
    colorStops: string[]
    blend: number
    amplitude: number
    speed: number
    className?: string
}

type IridescenceProps = {
    color: [number, number, number]
    mouseReact: boolean
    amplitude: number
    speed: number
    className?: string
}

const BACKGROUNDS: Record<
    string,
    {
        component: FC<any>
        props: Record<string, any>
        wrapperClassName?: string
    }
> = {
    aurora: {
        component: Aurora as FC<AuroraProps>,
        props: {
            useThemeColors: true,
            amplitude: 0.5,
            speed: 0.4,
            size: 1,
        },
    },
    iridescence: {
        component: Iridescence as FC<IridescenceProps>,
        props: {
            color: [0.5, 0.5, 0.4],
            mouseReact: false,
            amplitude: 0.1,
            speed: 0.4,
        },
    },
    squares: {
        component: Squares as FC<SquaresProps>,
        props: {
            direction: 'diagonal',
            squareSize: 30,
        },
    },
    particles: {
        component: Particles as FC<ParticlesProps>,
        props: {
            moveParticlesOnHover: true,
            particleBaseSize: 150,
            particleCount: 220,
            speed: 0.15,
        },
        wrapperClassName: 'z-0',
    },
}

export function Background() {
    const { backgroundType } = useBackground() as {
        backgroundType: BackgroundType
    }
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    if (!backgroundType || !BACKGROUNDS[backgroundType]) return null

    const backgroundConfig = BACKGROUNDS[backgroundType]

    const BackgroundComponent = backgroundConfig.component
    const componentProps = { ...backgroundConfig.props }

    const wrapperClassName = backgroundConfig.wrapperClassName || ''

    return (
        <div
            className={cn(
                'pointer-events-auto fixed inset-0 -z-10 h-screen w-screen overflow-hidden',
                wrapperClassName,
            )}
        >
            <BackgroundComponent {...componentProps} />
        </div>
    )
}
