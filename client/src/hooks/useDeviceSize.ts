import { useMediaQuery } from './useMediaQuery'

const breakpoints = {
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 1223px)',
    laptop: '(min-width: 1224px)',
}

export function useDeviceSize() {
    const isMobile = useMediaQuery(breakpoints.mobile)
    const isTablet = useMediaQuery(breakpoints.tablet)
    const isLaptop = useMediaQuery(breakpoints.laptop)

    return {
        isMobile,
        isTablet,
        isLaptop,
    }
}
