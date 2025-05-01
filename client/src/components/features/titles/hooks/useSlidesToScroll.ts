import { useMediaQuery } from '@/hooks/useMediaQuery'

export function useSlidesToScroll() {
    const isMd = useMediaQuery('(min-width: 768px)')
    const isLg = useMediaQuery('(min-width: 1024px)')
    const isXl = useMediaQuery('(min-width: 1280px)')

    if (isXl) return 1
    if (isMd) return 2
    if (isLg) return 3
    return 1
}
