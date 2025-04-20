import {
    SITE_DEFAULT_TITLE,
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_TITLE_TEMPLATE,
} from '@/libs/constants/seo.constants'
import { APP_URL } from '@/libs/constants/url.constants'
import { type Metadata, type Viewport } from 'next'

export const createMetadata = (props?: Partial<Metadata>): Metadata => ({
    applicationName: SITE_NAME,
    title: {
        default: SITE_DEFAULT_TITLE,
        template: SITE_TITLE_TEMPLATE,
    },
    description: SITE_DESCRIPTION,
    manifest: '/manifest.json',
    metadataBase: new URL(APP_URL),
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: SITE_NAME,
    },
    formatDetection: {
        telephone: false,
        email: false,
        address: false,
    },
    openGraph: {
        type: 'website',
        siteName: SITE_NAME,
        title: {
            default: SITE_DEFAULT_TITLE,
            template: SITE_TITLE_TEMPLATE,
        },
        description: SITE_DESCRIPTION,
    },
    twitter: {
        card: 'summary',
        title: {
            default: SITE_DEFAULT_TITLE,
            template: SITE_TITLE_TEMPLATE,
        },
        description: SITE_DESCRIPTION,
    },
    ...props,
})

export const viewport: Viewport = {
    themeColor: '#FFFFFF',
}
