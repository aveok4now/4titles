export const APP_CONFIG = {
    name: '4Titles',
    defaultTitle: '4Titles - Movie Locations Explorer',
    titleTemplate: '%s - 4Titles',
    description:
        'Movie filming locations and more. Explore iconic movie scenes, find exact filming spots, and discover cinema history around the world.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://4titles.com',
} as const
