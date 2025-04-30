'use client'

import { AnimatedList } from '@/components/ui/custom/content/animated-list'
import { SITE_NAME } from '@/libs/constants/seo.constants'
import { cn } from '@/utils/tw-merge'
import { useTranslations } from 'next-intl'

interface Item {
    name: string
    description: string
    icon: string
    color: string
    time: string
}

const Notification = ({ name, description, icon, color, time }: Item) => {
    return (
        <figure
            className={cn(
                'relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4',
                'transition-all duration-200 ease-in-out hover:scale-[103%]',
                'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
                'transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
            )}
        >
            <div className='flex flex-row items-center gap-3'>
                <div
                    className='flex size-10 items-center justify-center rounded-2xl'
                    style={{
                        backgroundColor: color,
                    }}
                >
                    <span className='text-lg'>{icon}</span>
                </div>
                <div className='flex flex-col overflow-hidden'>
                    <figcaption className='flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white'>
                        <span className='truncate text-sm sm:text-lg'>
                            {name}
                        </span>
                        <span className='mx-1'>·</span>
                        <span className='text-xs text-gray-500'>{time}</span>
                    </figcaption>
                    <p className='text-sm font-normal dark:text-white/60'>
                        {description}
                    </p>
                </div>
            </div>
        </figure>
    )
}

export function HomeNotificationsList({ className }: { className?: string }) {
    const t = useTranslations('home.about.notifications.list')

    let notifications = [
        {
            name: t('newFollower.name'),
            description: SITE_NAME,
            time: t('newFollower.time'),
            icon: '👥',
            color: '#00C9A7',
        },
        {
            name: t('siteUpdate.name'),
            description: SITE_NAME,
            time: t('siteUpdate.time'),
            icon: '🔄',
            color: '#FFB800',
        },
        {
            name: t('feedbackResponse.name'),
            description: SITE_NAME,
            time: t('feedbackResponse.time'),
            icon: '🙏',
            color: '#FF3D71',
        },
        {
            name: t('totpEnabled.name'),
            description: SITE_NAME,
            time: t('totpEnabled.time'),
            icon: '🔐',
            color: '#1E86FF',
        },
    ]

    notifications = Array.from({ length: 10 }, () => notifications).flat()

    return (
        <div
            className={cn(
                'relative flex h-[500px] w-full flex-col overflow-hidden p-2',
                className,
            )}
        >
            <AnimatedList>
                {notifications.map((item, idx) => (
                    <Notification {...item} key={idx} />
                ))}
            </AnimatedList>

            <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-background to-transparent' />
            <div className='pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent to-background/80 sm:to-background/60 md:to-transparent' />
            <div className='pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background'></div>
        </div>
    )
}
