'use client'

import { useConfig } from '@/hooks/useConfig'
import { getThemeColors } from '@/utils/get-theme-colors'
import { hexToRgb, RGBColor } from '@/utils/hex-to-rgb'
import { cn } from '@/utils/tw-merge'
import createGlobe, { COBEOptions } from 'cobe'
import { useMotionValue, useSpring } from 'motion/react'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useRef } from 'react'

const MOVEMENT_DAMPING = 1400

const getGlobeConfig = (
    theme: string | undefined,
    themeColors: string[] = [],
): COBEOptions => {
    const isDark = theme === 'dark'

    const [primaryColor, secondaryColor, accentColor] =
        themeColors.map(hexToRgb)

    const baseColor: RGBColor =
        primaryColor || (isDark ? [0.1, 0.1, 0.1] : [1, 1, 1])
    const markerColor: RGBColor =
        secondaryColor || (isDark ? [0.8, 0.8, 0.8] : [0.2, 0.2, 0.2])
    const glowColor: RGBColor =
        accentColor || (isDark ? [0.2, 0.2, 0.2] : [0.8, 0.8, 0.8])

    return {
        width: 800,
        height: 800,
        onRender: () => {},
        devicePixelRatio: 2,
        phi: 0,
        theta: 0.3,
        dark: isDark ? 1 : 0,
        diffuse: 0.4,
        mapSamples: 16000,
        mapBrightness: isDark ? 0.8 : 1.2,
        baseColor,
        markerColor,
        glowColor,
        markers: [
            { location: [14.5995, 120.9842], size: 0.03 },
            { location: [19.076, 72.8777], size: 0.1 },
            { location: [23.8103, 90.4125], size: 0.05 },
            { location: [30.0444, 31.2357], size: 0.07 },
            { location: [39.9042, 116.4074], size: 0.08 },
            { location: [-23.5505, -46.6333], size: 0.1 },
            { location: [19.4326, -99.1332], size: 0.1 },
            { location: [40.7128, -74.006], size: 0.1 },
            { location: [34.6937, 135.5022], size: 0.05 },
            { location: [41.0082, 28.9784], size: 0.06 },
            { location: [48.8566, 2.3522], size: 0.08 },
            { location: [51.5074, -0.1278], size: 0.09 },
            { location: [55.7558, 37.6173], size: 0.07 },
            { location: [-33.8688, 151.2093], size: 0.06 },
            { location: [-34.6037, -58.3816], size: 0.05 },
            { location: [1.3521, 103.8198], size: 0.04 },
            { location: [37.7749, -122.4194], size: 0.07 },
            { location: [43.6532, -79.3832], size: 0.05 },
            { location: [-26.2041, 28.0473], size: 0.04 },
            { location: [59.3293, 18.0686], size: 0.03 },
            { location: [35.6762, 139.6503], size: 0.1 },
            { location: [22.3193, 114.1694], size: 0.05 },
            { location: [25.276987, 55.296249], size: 0.06 },
            { location: [28.6139, 77.209], size: 0.08 },
            { location: [-6.2088, 106.8456], size: 0.07 },
            { location: [50.8503, 4.3517], size: 0.04 },
            { location: [52.52, 13.405], size: 0.07 },
            { location: [45.4215, -75.6972], size: 0.05 },
            { location: [41.9028, 12.4964], size: 0.08 },
            { location: [60.1699, 24.9384], size: 0.03 },
            { location: [-36.8485, 174.7633], size: 0.04 },
            { location: [19.4326, -99.1332], size: 0.06 },
            { location: [37.5665, 126.978], size: 0.08 },
            { location: [21.3069, -157.8583], size: 0.03 },
            { location: [39.9334, 32.8597], size: 0.05 },
            { location: [24.7136, 46.6753], size: 0.06 },
            { location: [13.7563, 100.5018], size: 0.05 },
            { location: [-22.9068, -43.1729], size: 0.09 },
            { location: [-12.0464, -77.0428], size: 0.05 },
            { location: [30.2672, -97.7431], size: 0.05 },
        ],
    }
}

export function Globe({
    className,
    config,
}: {
    className?: string
    config?: Partial<COBEOptions>
}) {
    const { resolvedTheme: theme } = useTheme()
    const { theme: configTheme } = useConfig()

    const themeColors = useMemo(() => {
        if (typeof window !== 'undefined') {
            try {
                return getThemeColors()
            } catch (error) {
                console.error('Failed to get theme colors', error)
                return []
            }
        }
        return []
    }, [configTheme])

    const globeConfig = useMemo(
        () => getGlobeConfig(theme, themeColors),
        [theme, themeColors],
    )

    let phi = 0
    let width = 0
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pointerInteracting = useRef<number | null>(null)
    const pointerInteractionMovement = useRef(0)

    const r = useMotionValue(0)
    const rs = useSpring(r, {
        mass: 1,
        damping: 30,
        stiffness: 100,
    })

    const updatePointerInteraction = (value: number | null) => {
        pointerInteracting.current = value
        if (canvasRef.current) {
            canvasRef.current.style.cursor =
                value !== null ? 'grabbing' : 'grab'
        }
    }

    const updateMovement = (clientX: number) => {
        if (pointerInteracting.current !== null) {
            const delta = clientX - pointerInteracting.current
            pointerInteractionMovement.current = delta
            r.set(r.get() + delta / MOVEMENT_DAMPING)
        }
    }

    useEffect(() => {
        const onResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.offsetWidth
            }
        }

        window.addEventListener('resize', onResize)
        onResize()

        const globe = createGlobe(canvasRef.current!, {
            ...globeConfig,
            ...config,
            width: width * 2,
            height: width * 2,
            onRender: state => {
                if (!pointerInteracting.current) phi += 0.005
                state.phi = phi + rs.get()
                state.width = width * 2
                state.height = width * 2
            },
        })

        setTimeout(() => (canvasRef.current!.style.opacity = '1'), 0)
        return () => {
            globe.destroy()
            window.removeEventListener('resize', onResize)
        }
    }, [rs, globeConfig, config])

    return (
        <div
            className={cn(
                'absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]',
                className,
            )}
        >
            <canvas
                className={cn(
                    'size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]',
                )}
                ref={canvasRef}
                onPointerDown={e => {
                    pointerInteracting.current = e.clientX
                    updatePointerInteraction(e.clientX)
                }}
                onPointerUp={() => updatePointerInteraction(null)}
                onPointerOut={() => updatePointerInteraction(null)}
                onMouseMove={e => updateMovement(e.clientX)}
                onTouchMove={e =>
                    e.touches[0] && updateMovement(e.touches[0].clientX)
                }
            />
        </div>
    )
}
