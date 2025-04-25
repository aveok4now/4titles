'use client'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/common/popover'
import { useFindUnreadNotificationsCountQuery } from '@/graphql/generated/output'
import { useCurrent } from '@/hooks/useCurrent'
import { Bell } from 'lucide-react'
import { NotificationsList } from './NotificationsList'

export function Notifications() {
    const { profile, isLoadingProfile } = useCurrent()

    if (isLoadingProfile || !profile) return null

    const isSiteNotificationsEnabled = Boolean(
        profile.notificationSettings?.isSiteNotificationsEnabled,
    )

    const { data, loading: isLoadingCount } =
        useFindUnreadNotificationsCountQuery({
            skip: !isSiteNotificationsEnabled,
        })

    const count = data?.findUnreadCount ?? 0
    const displayCount = count > 10 ? '+9' : count

    if (isLoadingCount) return null

    return (
        <Popover>
            <PopoverTrigger>
                {count !== 0 && (
                    <div className='right-18 absolute top-5 rounded-full bg-primary px-[5px] text-xs font-semibold text-white'>
                        {displayCount}
                    </div>
                )}
                <Bell className='size-5 text-foreground' />
            </PopoverTrigger>
            <PopoverContent
                className='max-h-[30rem] w-[24rem] overflow-y-auto'
                align='end'
            >
                <NotificationsList isEnabled={isSiteNotificationsEnabled} />
            </PopoverContent>
        </Popover>
    )
}
