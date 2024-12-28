import { type Metadata, type Viewport } from 'next'
import { APP_CONFIG } from './app'

export const createMetadata = (props?: Partial<Metadata>): Metadata => ({
    applicationName: APP_CONFIG.name,
    title: {
        default: APP_CONFIG.defaultTitle,
        template: APP_CONFIG.titleTemplate,
    },
    description: APP_CONFIG.description,
    manifest: '/manifest.json',
    metadataBase: new URL(APP_CONFIG.url),
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: APP_CONFIG.name,
    },
    formatDetection: {
        telephone: false,
        email: false,
        address: false,
    },
    openGraph: {
        type: 'website',
        siteName: APP_CONFIG.name,
        title: {
            default: APP_CONFIG.defaultTitle,
            template: APP_CONFIG.titleTemplate,
        },
        description: APP_CONFIG.description,
    },
    twitter: {
        card: 'summary',
        title: {
            default: APP_CONFIG.defaultTitle,
            template: APP_CONFIG.titleTemplate,
        },
        description: APP_CONFIG.description,
    },
    ...props,
})

export const viewport: Viewport = {
    themeColor: '#FFFFFF',
}
