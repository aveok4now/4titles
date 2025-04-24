import { CircleHelp } from 'lucide-react'
import { IconType } from 'react-icons'
import {
    FaAndroid,
    FaApple,
    FaChrome,
    FaDesktop,
    FaEdge,
    FaFirefoxBrowser,
    FaLinux,
    FaMobile,
    FaOpera,
    FaSafari,
    FaTabletAlt,
    FaTv,
    FaWindows,
    FaYandex,
} from 'react-icons/fa'

type DeviceMetadata = {
    browser: string
    os: string
    type: string
}

function normalizeBrowserName(browser: string): string {
    const name = browser.toLowerCase().trim()

    if (name.includes('chrome') || name.includes('chromium')) return 'chrome'
    if (name.includes('firefox')) return 'firefox'
    if (name.includes('safari') && !name.includes('chrome')) return 'safari'
    if (name.includes('edge') || name.includes('edg')) return 'edge'
    if (name.includes('opera')) return 'opera'
    if (name.includes('yandex')) return 'yandex'
    if (name.includes('samsung')) return 'samsung'
    if (name.includes('ucbrowser')) return 'uc'
    if (name.includes('miui')) return 'miui'

    return name
}

function normalizeOSName(os: string): string {
    const name = os.toLowerCase().trim()

    if (name.includes('android')) return 'android'
    if (
        name.includes('ios') ||
        name.includes('iphone') ||
        name.includes('ipad')
    )
        return 'ios'
    if (name.includes('mac') || name.includes('macos')) return 'macos'
    if (name.includes('windows')) return 'windows'
    if (name.includes('linux')) return 'linux'
    if (
        name.includes('ubuntu') ||
        name.includes('debian') ||
        name.includes('fedora')
    )
        return 'linux'

    return name
}

function determineDeviceType(metadata: DeviceMetadata): string {
    if (metadata.type) return metadata.type.toLowerCase()

    const os = metadata.os.toLowerCase()
    const browser = metadata.browser.toLowerCase()

    if (
        os.includes('android') ||
        os.includes('ios') ||
        browser.includes('mobile')
    ) {
        return 'mobile'
    }

    if (os.includes('ipad') || browser.includes('tablet')) {
        return 'tablet'
    }

    if (
        os.includes('tv') ||
        os.includes('android tv') ||
        os.includes('apple tv')
    ) {
        return 'tv'
    }

    return 'desktop'
}

function getBrowserIconByName(browserName: string): IconType {
    const normalizedName = normalizeBrowserName(browserName)

    switch (normalizedName) {
        case 'chrome':
            return FaChrome
        case 'firefox':
            return FaFirefoxBrowser
        case 'safari':
            return FaSafari
        case 'edge':
            return FaEdge
        case 'opera':
            return FaOpera
        case 'yandex':
            return FaYandex
        default:
            return CircleHelp
    }
}

function getOSIconByName(osName: string): IconType {
    const normalizedName = normalizeOSName(osName)

    switch (normalizedName) {
        case 'android':
            return FaAndroid
        case 'ios':
        case 'macos':
            return FaApple
        case 'windows':
            return FaWindows
        case 'linux':
            return FaLinux
        default:
            return FaDesktop
    }
}

function getDeviceTypeIcon(deviceType: string): IconType {
    switch (deviceType) {
        case 'mobile':
            return FaMobile
        case 'tablet':
            return FaTabletAlt
        case 'tv':
            return FaTv
        case 'desktop':
            return FaDesktop
        default:
            return CircleHelp
    }
}

export function getDeviceIcon(metadata: DeviceMetadata): IconType {
    const deviceType = determineDeviceType(metadata)

    const browserIcon = getBrowserIconByName(metadata.browser)
    if (browserIcon !== CircleHelp) return browserIcon

    const osIcon = getOSIconByName(metadata.os)
    if (osIcon !== FaDesktop) return osIcon

    return getDeviceTypeIcon(deviceType)
}

export function getBrowserIcon(browser: string): IconType {
    return getBrowserIconByName(browser) || CircleHelp
}
