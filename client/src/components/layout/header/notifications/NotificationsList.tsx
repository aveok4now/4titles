'use client'

import { Separator } from '@/components/ui/common/separator'
import { Skeleton } from '@/components/ui/common/skeleton'
import ShinyText from '@/components/ui/custom/text/shiny-text'
import {
    useFindNotificationsByUserQuery,
    useFindUnreadNotificationsCountQuery,
} from '@/graphql/generated/output'
import { getNotificationIcon } from '@/utils/get-notification-icon'
import parse from 'html-react-parser'
import { useTranslations } from 'next-intl'
import { Fragment, useCallback, useEffect, useState } from 'react'

export function NotificationsList() {
    const t = useTranslations('layout.header.menu.profile.notifications')

    const [showSkeleton, setShowSkeleton] = useState(false)

    const { refetch: refetchUnreadCount } =
        useFindUnreadNotificationsCountQuery()

    const {
        data,
        loading: isLoadingNotifications,
        refetch: refetchNotifications,
    } = useFindNotificationsByUserQuery()

    const notifications = data?.findByUser ?? []

    useEffect(() => {
        let timeout: NodeJS.Timeout

        if (isLoadingNotifications) {
            timeout = setTimeout(() => {
                setShowSkeleton(true)
            }, 300)
        } else {
            setShowSkeleton(false)
        }

        return () => {
            clearTimeout(timeout)
        }
    }, [isLoadingNotifications])

    const handleNotificationsUpdate = useCallback(() => {
        refetchNotifications().then(() => {
            refetchUnreadCount()
        })
    }, [refetchNotifications, refetchUnreadCount])

    useEffect(() => {
        handleNotificationsUpdate()
    }, [handleNotificationsUpdate])

    const showContent =
        !isLoadingNotifications || (isLoadingNotifications && !showSkeleton)
    const showLoadingSkeleton = isLoadingNotifications && showSkeleton

    return (
        <>
            <div className='flex justify-center'>
                <ShinyText
                    text={t('heading')}
                    className='text-lg font-medium text-foreground/85'
                />
            </div>
            <Separator className='my-3' />

            {showLoadingSkeleton && <NotificationSkeleton />}

            {showContent && (
                <>
                    {notifications.length ? (
                        notifications.map((notification, index) => {
                            const Icon = getNotificationIcon(notification.type)

                            return (
                                <Fragment key={notification.id || index}>
                                    <div className='flex items-center gap-x-3 text-sm'>
                                        <div className='rounded-full bg-border p-2'>
                                            <Icon className='size-6 text-secondary' />
                                        </div>
                                        <div className='flex-1'>
                                            {parse(notification.message)}
                                        </div>
                                    </div>
                                    {index < notifications.length - 1 && (
                                        <Separator className='my-3' />
                                    )}
                                </Fragment>
                            )
                        })
                    ) : (
                        <div className='flex items-center justify-center py-4 text-center text-muted-foreground'>
                            {t('empty')}
                        </div>
                    )}
                </>
            )}
        </>
    )
}

function NotificationSkeleton() {
    return (
        <>
            {[1, 2, 3].map(item => (
                <Fragment key={item}>
                    <div className='flex items-center gap-x-3 py-2'>
                        <Skeleton className='size-10 rounded-full' />
                        <div className='flex-1 space-y-2'>
                            <Skeleton className='h-4 w-full' />
                            <Skeleton className='h-4 w-3/4' />
                        </div>
                    </div>
                    {item < 3 && <Separator className='my-3' />}
                </Fragment>
            ))}
        </>
    )
}
