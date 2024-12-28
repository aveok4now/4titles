import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import withPWA from '@ducanh2912/next-pwa'

const withNextIntl = createNextIntlPlugin('./src/libs/i18n/request.ts')

const withPWAConfig = withPWA({
    dest: 'public',

    // Basic PWA settings
    // disable: process.env.NODE_ENV === 'development',
    register: true,
    scope: '/',
    sw: 'service-worker.js',

    // Caching settings
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    cacheStartUrl: true,
    reloadOnOnline: true,

    // Workbox settings
    extendDefaultRuntimeCaching: true,
    workboxOptions: {
        runtimeCaching: [
            {
                urlPattern:
                    /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'google-fonts',
                    expiration: {
                        maxEntries: 4,
                        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
                    },
                },
            },
            {
                urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'static-font-assets',
                    expiration: {
                        maxEntries: 4,
                        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
                    },
                },
            },
            {
                urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'static-image-assets',
                    expiration: {
                        maxEntries: 64,
                        maxAgeSeconds: 24 * 60 * 60, // 1 day
                    },
                },
            },
            {
                urlPattern: /\.(?:js)$/i,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'static-js-assets',
                    expiration: {
                        maxEntries: 32,
                        maxAgeSeconds: 24 * 60 * 60, // 1 day
                    },
                },
            },
            {
                urlPattern: /\.(?:css|less)$/i,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'static-style-assets',
                    expiration: {
                        maxEntries: 32,
                        maxAgeSeconds: 24 * 60 * 60, // 1 day
                    },
                },
            },
            {
                urlPattern: /\.(?:json|xml|csv)$/i,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'static-data-assets',
                    expiration: {
                        maxEntries: 32,
                        maxAgeSeconds: 24 * 60 * 60, // 1 day
                    },
                },
            },
            {
                urlPattern: /^https?.*/,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'offline-cache',
                    expiration: {
                        maxEntries: 200,
                        maxAgeSeconds: 24 * 60 * 60, // 1 day
                    },
                    networkTimeoutSeconds: 10,
                    matchOptions: {
                        ignoreSearch: true,
                    },
                },
            },
        ],
    },

    publicExcludes: ['!noprecache/**/*'],
})

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
}

export default withNextIntl(withPWAConfig(nextConfig))
