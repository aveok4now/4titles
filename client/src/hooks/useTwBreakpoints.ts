import { useMediaQuery } from './useMediaQuery'

export function useTwBreakPoints() {
    const is2xl = useMediaQuery('(min-width: 1536px)')
    const isXl = useMediaQuery('(min-width: 1280px) and (max-width: 1535px)')
    const isLg = useMediaQuery('(min-width: 1024px) and (max-width: 1279px)')
    const isMd = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
    const isSm = useMediaQuery('(min-width: 640px) and (max-width: 767px)')
    const isXs = useMediaQuery('(max-width: 639px)')

    return {
        is2xl,
        isXl,
        isLg,
        isMd,
        isSm,
        isXs,
    }
}
