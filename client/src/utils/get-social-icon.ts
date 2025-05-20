import { Link as LinkIcon } from 'lucide-react'
import {
    FaDiscord,
    FaFacebook,
    FaGithub,
    FaInstagram,
    FaLinkedin,
    FaMedium,
    FaPinterest,
    FaReddit,
    FaSnapchat,
    FaSoundcloud,
    FaSpotify,
    FaStackOverflow,
    FaSteam,
    FaTelegram,
    FaThreads,
    FaTiktok,
    FaTwitch,
    FaVk,
    FaWhatsapp,
    FaXTwitter,
    FaYoutube,
} from 'react-icons/fa6'

const SOCIAL_PLATFORMS = {
    telegram: {
        icon: FaTelegram,
        patterns: [/t\.me/, /telegram\.org/, /telegram\.me/],
        name: 'Telegram',
        color: '#0088cc',
    },
    youtube: {
        icon: FaYoutube,
        patterns: [/youtube\.com/, /youtu\.be/],
        name: 'YouTube',
        color: '#FF0000',
    },
    twitter: {
        icon: FaXTwitter,
        patterns: [/twitter\.com/, /x\.com/],
        name: 'X (Twitter)',
        color: '#1DA1F2',
    },
    discord: {
        icon: FaDiscord,
        patterns: [/discord\.com/, /discord\.gg/],
        name: 'Discord',
        color: '#5865F2',
    },
    tiktok: {
        icon: FaTiktok,
        patterns: [/tiktok\.com/],
        name: 'TikTok',
        color: '#000000',
    },
    github: {
        icon: FaGithub,
        patterns: [/github\.com/, /github\.io/],
        name: 'GitHub',
        color: '#333333',
    },
    instagram: {
        icon: FaInstagram,
        patterns: [/instagram\.com/, /instagr\.am/],
        name: 'Instagram',
        color: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
    },
    facebook: {
        icon: FaFacebook,
        patterns: [/facebook\.com/, /fb\.com/, /fb\.me/],
        name: 'Facebook',
        color: '#1877F2',
    },
    linkedin: {
        icon: FaLinkedin,
        patterns: [/linkedin\.com/, /linked\.in/],
        name: 'LinkedIn',
        color: '#0A66C2',
    },
    reddit: {
        icon: FaReddit,
        patterns: [/reddit\.com/],
        name: 'Reddit',
        color: '#FF4500',
    },
    twitch: {
        icon: FaTwitch,
        patterns: [/twitch\.tv/],
        name: 'Twitch',
        color: '#9146FF',
    },
    pinterest: {
        icon: FaPinterest,
        patterns: [/pinterest\.com/, /pin\.it/],
        name: 'Pinterest',
        color: '#E60023',
    },
    snapchat: {
        icon: FaSnapchat,
        patterns: [/snapchat\.com/],
        name: 'Snapchat',
        color: '#FFFC00',
    },
    medium: {
        icon: FaMedium,
        patterns: [/medium\.com/],
        name: 'Medium',
        color: '#000000',
    },
    spotify: {
        icon: FaSpotify,
        patterns: [/spotify\.com/, /open\.spotify\.com/],
        name: 'Spotify',
        color: '#1DB954',
    },
    soundcloud: {
        icon: FaSoundcloud,
        patterns: [/soundcloud\.com/],
        name: 'SoundCloud',
        color: '#FF3300',
    },
    stackoverflow: {
        icon: FaStackOverflow,
        patterns: [/stackoverflow\.com/, /stack-overflow/],
        name: 'Stack Overflow',
        color: '#F48024',
    },
    steam: {
        icon: FaSteam,
        patterns: [/steampowered\.com/, /steamcommunity\.com/],
        name: 'Steam',
        color: '#1b2838',
    },
    whatsapp: {
        icon: FaWhatsapp,
        patterns: [/whatsapp\.com/, /wa\.me/],
        name: 'WhatsApp',
        color: '#25D366',
    },
    vk: {
        icon: FaVk,
        patterns: [/vk\.com/, /vkontakte\.ru/],
        name: 'VKontakte',
        color: '#4C75A3',
    },
    threads: {
        icon: FaThreads,
        patterns: [/threads\.net/],
        name: 'Threads',
        color: '#000000',
    },
}

export function getSocialIcon(url: string) {
    if (!url) return LinkIcon

    const normalizedUrl = url
        .toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, '')

    for (const [_, platform] of Object.entries(SOCIAL_PLATFORMS)) {
        if (platform.patterns.some(pattern => pattern.test(normalizedUrl))) {
            return platform.icon
        }
    }

    return LinkIcon
}

export function getSocialPlatformName(url: string) {
    if (!url) return 'Link'

    const normalizedUrl = url
        .toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, '')

    for (const [_, platform] of Object.entries(SOCIAL_PLATFORMS)) {
        if (platform.patterns.some(pattern => pattern.test(normalizedUrl))) {
            return platform.name
        }
    }

    return 'Link'
}

export function getSocialColor(url: string) {
    if (!url) return 'hsl(var(--primary))'

    const normalizedUrl = url
        .toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, '')

    for (const [_, platform] of Object.entries(SOCIAL_PLATFORMS)) {
        if (platform.patterns.some(pattern => pattern.test(normalizedUrl))) {
            return platform.color
        }
    }

    return 'hsl(var(--primary))'
}

export function isSocialUrl(url: string) {
    if (!url) return false

    const normalizedUrl = url
        .toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, '')

    return Object.values(SOCIAL_PLATFORMS).some(platform =>
        platform.patterns.some(pattern => pattern.test(normalizedUrl)),
    )
}

export function getAllSocialPlatforms() {
    return Object.entries(SOCIAL_PLATFORMS).map(([key, platform]) => ({
        key,
        name: platform.name,
        Icon: platform.icon,
        color: platform.color,
    }))
}

export { SOCIAL_PLATFORMS }
