'use client'

import type { FindProfileByUsernameQuery } from '@/graphql/generated/output'

import { Separator } from '@/components/ui/common/separator'
import ShinyText from '@/components/ui/custom/text/shiny-text'
import { Bookmark, MapPin, MessageCircle, User, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ProfileStatisticsCard } from './ProfileStatisticsCard'

interface ProfileStatisticsSectionProps {
    profile: FindProfileByUsernameQuery['findProfileByUsername']
}

export function ProfileStatisticsSection({
    profile,
}: ProfileStatisticsSectionProps) {
    const t = useTranslations('profile.statistics')

    return (
        <>
            <div className='flex items-center justify-between'>
                <ShinyText
                    text={t('heading')}
                    className='text-lg font-medium text-foreground'
                />
                <Separator className='mx-4 h-px flex-1 bg-border/50' />
            </div>

            <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
                <ProfileStatisticsCard
                    Icon={MapPin}
                    value={profile.locationsAdded || 0}
                    label={t('locationsAdded', {
                        count: profile.locationsAdded || 0,
                    })}
                    color='from-emerald-400 to-emerald-600'
                    delay={0.3}
                />

                <ProfileStatisticsCard
                    Icon={Bookmark}
                    value={profile.collectionsAdded || 0}
                    label={t('collectionsAdded', {
                        count: profile.collectionsAdded || 0,
                    })}
                    color='from-indigo-400 to-indigo-600'
                    delay={0.5}
                />

                <ProfileStatisticsCard
                    Icon={MessageCircle}
                    value={profile.commentsCreated || 0}
                    label={t('commentsCreated', {
                        count: profile.commentsCreated || 0,
                    })}
                    color='from-amber-400 to-amber-600'
                    delay={0.7}
                />
            </div>

            <div className='mt-4 flex flex-col gap-4 sm:flex-row'>
                <ProfileStatisticsCard
                    Icon={Users}
                    value={profile.followers?.length || 0}
                    label={t('follow.followersCount', {
                        count: profile.followers?.length || 0,
                    })}
                    color='from-rose-400 to-rose-600'
                    delay={0.9}
                />

                <ProfileStatisticsCard
                    Icon={User}
                    value={profile.followings?.length || 0}
                    label={t('follow.followingCount', {
                        count: profile.followings?.length || 0,
                    })}
                    color='from-blue-400 to-blue-600'
                    delay={1.1}
                />
            </div>
        </>
    )
}
