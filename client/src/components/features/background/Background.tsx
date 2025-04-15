'use client'

import Aurora from '@/components/ui/custom/backgrounds/aurora'
import GridMotion from '@/components/ui/custom/backgrounds/grid-motion'
import Iridescence from '@/components/ui/custom/backgrounds/iridescence'
import Particles, {
    ParticlesProps,
} from '@/components/ui/custom/backgrounds/particles'
import Squares, {
    SquaresProps,
} from '@/components/ui/custom/backgrounds/squares'
import { BackgroundType, useBackground } from '@/contexts/background-context'
import { cn } from '@/utils/tw-merge'
import { FC, ReactElement, ReactNode, useEffect, useState } from 'react'

type AuroraProps = {
    colorStops: string[]
    blend: number
    amplitude: number
    speed: number
    className?: string
}

type GridMotionProps = {
    items?: (string | ReactNode)[]
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
            colorStops: ['#3A29FF', '#FF94B4', '#FF3232'],
            blend: 1.0,
            amplitude: 0.5,
            speed: 0.5,
        },
    },
    grid: {
        component: GridMotion as FC<GridMotionProps>,
        props: {},
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
            particleColors: ['#9a9ffe', '#3A29FF', '#9a9ffe'],
            moveParticlesOnHover: true,
            particleBaseSize: 150,
            particleCount: 250,
            speed: 0.15,
        },
        wrapperClassName: 'z-0',
    },
}

const gridItems: (string | ReactElement)[] = [
    'Item 1',
    <div key='jsx-item-1'>Custom JSX Content</div>,
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Item 2',
    <div key='jsx-item-2a'>Custom JSX Content</div>,
    'Item 4',
    <div key='jsx-item-2b'>Custom JSX Content</div>,
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Item 5',
    <div key='jsx-item-2c'>Custom JSX Content</div>,
    'Item 7',
    <div key='jsx-item-2d'>Custom JSX Content</div>,
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Item 8',
    <div key='jsx-item-2e'>Custom JSX Content</div>,
    'Item 10',
    <div key='jsx-item-3'>Custom JSX Content</div>,
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Item 11',
    <div key='jsx-item-2f'>Custom JSX Content</div>,
    'Item 13',
    <div key='jsx-item-4'>Custom JSX Content</div>,
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Item 14',
]

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

    if (backgroundType === 'grid') {
        componentProps.items = gridItems
    }

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
