'use client'

import {
    useFollowUserMutation,
    useUnfollowUserMutation,
    type FindProfileByUsernameQuery,
} from '@/graphql/generated/output'

import { Button } from '@/components/ui/common/button'
import { CardTitle } from '@/components/ui/common/card'
import ShinyText from '@/components/ui/custom/text/shiny-text'
import { Link } from '@/components/ui/elements/Link'
import { ProfileAvatar } from '@/components/ui/elements/ProfileAvatar'
import { useCurrent } from '@/hooks/useCurrent'
import { formatDate } from '@/utils/format-date'
import { CalendarIcon, Mail, UserMinus, UserPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

interface ProfileInfoSectionProps {
    profile: FindProfileByUsernameQuery['findProfileByUsername']
}

export function ProfileInfoSection({ profile }: ProfileInfoSectionProps) {
    const t = useTranslations('profile.info')
    const { profile: currentProfile } = useCurrent()
    const [isFollowing, setIsFollowing] = useState<boolean>(
        profile.followers?.some(
            follower =>
                follower.follower?.username === currentProfile?.username,
        ) || false,
    )

    const [followUser] = useFollowUserMutation({
        onCompleted: () => {
            setIsFollowing(true)
            toast.success(t('followSuccess'), {
                description: t('followSuccessDescription', {
                    username: profile.displayName || profile.username,
                }),
            })
        },
        onError: error => {
            toast.error(t('followError'), {
                description: error.message,
            })
        },
    })

    const [unfollowUser] = useUnfollowUserMutation({
        onCompleted: () => {
            setIsFollowing(false)
            toast.success(t('unfollowSuccess'), {
                description: t('unfollowSuccessDescription', {
                    username: profile.displayName || profile.username,
                }),
            })
        },
        onError: error => {
            toast.error(t('unfollowError'), {
                description: error.message,
            })
        },
    })

    const handleFollowToggle = () => {
        if (isFollowing) {
            unfollowUser({ variables: { followingId: profile.id } })
        } else {
            followUser({ variables: { followingId: profile.id } })
        }
    }

    const formattedDate = formatDate(new Date(profile.createdAt))
    const isCurrentUser = currentProfile?.id === profile.id

    return (
        <div className='flex flex-col items-start gap-4 sm:flex-row'>
            <div className='flex w-full flex-row items-end space-x-4 space-y-4 sm:w-auto sm:flex-col sm:items-center sm:space-x-0 sm:space-y-2'>
                <ProfileAvatar profile={profile} size='xl' />

                {!isCurrentUser && (
                    <Button
                        onClick={handleFollowToggle}
                        variant={isFollowing ? 'outline' : 'default'}
                        className='mt-2 w-full max-w-36'
                    >
                        {isFollowing ? (
                            <>
                                <UserMinus className='mr-2 size-4' />
                                {t('unfollow')}
                            </>
                        ) : (
                            <>
                                <UserPlus className='mr-2 size-4' />
                                {t('follow')}
                            </>
                        )}
                    </Button>
                )}
            </div>

            <div className='flex w-full flex-col space-y-1.5 overflow-hidden'>
                <CardTitle className='max-w-full truncate text-2xl font-bold'>
                    <ShinyText
                        text={profile.displayName || profile.username}
                        className='text-foreground/85'
                    />
                </CardTitle>
                <div className='flex items-center text-muted-foreground'>
                    <span className='truncate'>@{profile.username}</span>
                </div>
                <div className='flex items-center text-muted-foreground'>
                    <Mail className='mr-1 size-4 flex-shrink-0 text-primary' />
                    <Link
                        href={`mailto:${profile.email}`}
                        className='text-md truncate'
                    >
                        {profile.email}
                    </Link>
                </div>
                <div className='flex items-center text-muted-foreground'>
                    <CalendarIcon className='mr-1 size-4 flex-shrink-0' />
                    <span className='truncate'>
                        {t('memberSince', {
                            date: formattedDate,
                        })}
                    </span>
                </div>
            </div>
        </div>
    )
}
