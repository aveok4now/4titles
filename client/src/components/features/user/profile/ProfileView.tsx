'use client'

import { Button } from '@/components/ui/common/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/common/card'
import { TimelineElement } from '@/components/ui/common/timeline'
import FadeContent from '@/components/ui/custom/content/fade-content'
import CountUp from '@/components/ui/custom/text/count-up'
import ShinyText from '@/components/ui/custom/text/shiny-text'
import { AccentSpotlight } from '@/components/ui/elements/AccentSpotlight'
import GlassIcons from '@/components/ui/elements/GlassIcons'
import { Link } from '@/components/ui/elements/Link'
import { ProfileAvatar } from '@/components/ui/elements/ProfileAvatar'
import { TimelineLayout } from '@/components/ui/elements/TimelineLayout'
import {
    useFollowUserMutation,
    useUnfollowUserMutation,
    type FindProfileByUsernameQuery,
} from '@/graphql/generated/output'
import { useCurrent } from '@/hooks/useCurrent'
import { formatTimeAgo } from '@/utils/date/format-time-ago'
import { formatDate } from '@/utils/format-date'
import { getSocialColor, getSocialIcon } from '@/utils/get-social-icon'
import {
    Bookmark,
    CalendarIcon,
    Mail,
    MapPin,
    MessageSquare,
    Shapes,
    User,
    UserMinus,
    UserPlus,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

interface ProfileViewProps {
    profile: FindProfileByUsernameQuery['findProfileByUsername']
}

export function ProfileView({ profile }: ProfileViewProps) {
    const t = useTranslations('profile')
    const locale = useLocale()

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

    const getActivityTimelineItems = (): TimelineElement[] => {
        const items: TimelineElement[] = []

        profile.activity?.collections.forEach((collection, index) => {
            items.push({
                id: index,
                date: formatTimeAgo(new Date(collection.createdAt), locale),
                title: t('createdCollection'),
                description: `${collection.title} (${t('itemsCount', { count: collection.itemsCount })})`,
                icon: <Shapes className='size-4' />,
            })
        })

        profile.activity?.filmingLocations.forEach((location, index) => {
            items.push({
                id: items.length + index,
                date: formatDate(new Date(location.createdAt)),
                title: t('addedLocation'),
                description: location.formattedAddress || location.address,
                icon: <MapPin className='size-4' />,
            })
        })

        return items.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
    }

    const socialItems =
        profile.socialLinks
            ?.sort((a, b) => a.position - b.position)
            .map(link => {
                const Icon = getSocialIcon(link.url)
                return {
                    icon: <Icon className='size-4 text-foreground' />,
                    color: getSocialColor(link.url),
                    label: link.title,
                    customClass: 'cursor-pointer',
                    url: link.url,
                }
            }) || []

    const formattedDate = formatDate(new Date(profile.createdAt))
    const isCurrentUser = currentProfile?.id === profile.id

    return (
        <div className='mx-auto mt-4 w-full max-w-7xl'>
            <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'>
                <Card className='bg-background/60 md:col-span-2 lg:col-span-2'>
                    <CardHeader className='flex flex-col items-start gap-4 sm:flex-row'>
                        <FadeContent blur>
                            <div className='flex w-full flex-row items-end space-x-4 space-y-4 sm:w-auto sm:flex-col sm:items-center sm:space-x-0 sm:space-y-2'>
                                <ProfileAvatar profile={profile} size='xl' />

                                {!isCurrentUser && (
                                    <Button
                                        onClick={handleFollowToggle}
                                        variant={
                                            isFollowing ? 'outline' : 'default'
                                        }
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
                        </FadeContent>

                        <div className='flex w-full flex-col space-y-1.5 overflow-hidden'>
                            <CardTitle className='max-w-full truncate text-2xl font-bold'>
                                <ShinyText
                                    text={
                                        profile.displayName || profile.username
                                    }
                                    className='text-foreground/85'
                                />
                            </CardTitle>
                            <div className='flex items-center text-muted-foreground'>
                                <User className='mr-1 size-4 flex-shrink-0' />
                                <span className='truncate'>
                                    @{profile.username}
                                </span>
                            </div>
                            <div className='flex items-center text-muted-foreground'>
                                <Mail className='mr-1 size-4 flex-shrink-0' />
                                <Link
                                    href={`mailto:${profile.email}`}
                                    className='truncate'
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
                    </CardHeader>

                    <CardContent>
                        {socialItems.length > 0 && (
                            <FadeContent blur delay={1100}>
                                <ShinyText
                                    text={t('socialLinks')}
                                    className='mb-2 text-lg font-medium text-foreground/85'
                                />
                                <div className='-mx-6 overflow-x-auto px-6'>
                                    <GlassIcons
                                        items={socialItems}
                                        className='xs:grid-cols-3 grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4 lg:grid-cols-5'
                                    />
                                </div>
                            </FadeContent>
                        )}

                        <FadeContent blur delay={1200}>
                            <ShinyText
                                text={t('statistics')}
                                className='text-lg font-medium text-foreground'
                            />

                            <div className='mt-4 flex flex-col gap-4 sm:flex-row'>
                                <div className='flex flex-1 flex-col items-center rounded-lg border border-border p-4 text-center'>
                                    <MapPin className='mb-2 size-5 text-primary' />
                                    <span className='text-xl font-bold'>
                                        <CountUp
                                            to={profile.locationsAdded || 0}
                                            duration={1}
                                            className='text-xl'
                                        />
                                    </span>
                                    <span className='text-center text-xs text-muted-foreground'>
                                        {t('locationsAdded', {
                                            count: profile.locationsAdded || 0,
                                        })}
                                    </span>
                                </div>

                                <div className='flex flex-1 flex-col items-center rounded-lg border border-border p-4'>
                                    <Bookmark className='mb-2 size-5 text-primary' />
                                    <span className='text-xl font-bold'>
                                        <CountUp
                                            to={profile.collectionsAdded || 0}
                                            duration={1}
                                        />
                                    </span>
                                    <span className='text-center text-xs text-muted-foreground'>
                                        {t('collectionsAdded', {
                                            count:
                                                profile.collectionsAdded || 0,
                                        })}
                                    </span>
                                </div>

                                <div className='flex flex-1 flex-col items-center rounded-lg border border-border p-4 text-center'>
                                    <MessageSquare className='mb-2 size-5 text-primary' />
                                    <span className='text-lg font-bold'>
                                        <CountUp
                                            to={profile.commentsCreated || 0}
                                            duration={1}
                                        />
                                    </span>
                                    <span className='text-center text-xs text-muted-foreground'>
                                        {t('commentsCreated', {
                                            count: profile.commentsCreated || 0,
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className='mt-4 flex flex-col gap-4 sm:flex-row'>
                                <div className='flex flex-1 flex-col items-center rounded-lg border border-border p-4'>
                                    <h3 className='text-sm font-medium'>
                                        {t('followers')}
                                    </h3>
                                    <span className='text-lg font-bold'>
                                        <CountUp
                                            to={profile.followers?.length || 0}
                                            duration={1}
                                        />
                                    </span>
                                </div>

                                <div className='flex flex-1 flex-col items-center rounded-lg border border-border p-4'>
                                    <h3 className='text-sm font-medium'>
                                        {t('following')}
                                    </h3>
                                    <span className='text-lg font-bold'>
                                        <CountUp
                                            to={profile.followings?.length || 0}
                                            duration={1}
                                        />
                                    </span>
                                </div>
                            </div>
                        </FadeContent>
                    </CardContent>
                </Card>

                <Card className='bg-background/60 md:col-span-1 lg:col-span-2'>
                    <CardHeader>
                        <CardTitle>
                            <ShinyText
                                text={t('activity')}
                                className='text-foreground/85'
                            />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {getActivityTimelineItems().length > 0 ? (
                            <TimelineLayout
                                items={getActivityTimelineItems()}
                                size='sm'
                                iconColor='primary'
                                className='scrollbar-thin max-h-[400px] overflow-y-auto'
                            />
                        ) : (
                            <p className='text-center text-muted-foreground'>
                                {t('noActivity')}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card className='bg-background/60 md:col-span-2 lg:col-span-4'>
                    <FadeContent blur delay={1300}>
                        <CardHeader>
                            <CardTitle>
                                <ShinyText
                                    text={t('bio')}
                                    className='text-foreground/85'
                                />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {profile.bio ? (
                                <p className='whitespace-pre-wrap'>
                                    {profile.bio}
                                </p>
                            ) : (
                                <p className='text-center text-muted-foreground'>
                                    {t('noBio')}
                                </p>
                            )}
                        </CardContent>
                    </FadeContent>
                </Card>
            </div>

            <AccentSpotlight />
        </div>
    )
}
