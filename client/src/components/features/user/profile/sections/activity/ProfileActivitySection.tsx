'use client'

import type { FindProfileByUsernameQuery } from '@/graphql/generated/output'

import { CardContent, CardHeader, CardTitle } from '@/components/ui/common/card'
import { TimelineElement } from '@/components/ui/common/timeline'
import ShinyText from '@/components/ui/custom/text/shiny-text'
import { TimelineLayout } from '@/components/ui/elements/TimelineLayout'
import { formatTimeAgo } from '@/utils/date/format-time-ago'
import { MapPin, Shapes } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

interface ProfileActivitySectionProps {
    profile: FindProfileByUsernameQuery['findProfileByUsername']
}

export function ProfileActivitySection({
    profile,
}: ProfileActivitySectionProps) {
    const t = useTranslations('profile.activity')
    const locale = useLocale()

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
                date: formatTimeAgo(new Date(location.createdAt)),
                title: t('addedLocation'),
                description: location.formattedAddress || location.address,
                icon: <MapPin className='size-4' />,
            })
        })

        return items.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
    }

    const activityItems = getActivityTimelineItems()

    return (
        <>
            <CardHeader>
                <CardTitle>
                    <ShinyText
                        text={t('heading')}
                        className='text-foreground/85'
                    />
                </CardTitle>
            </CardHeader>
            <CardContent>
                {activityItems.length > 0 ? (
                    <TimelineLayout
                        items={activityItems}
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
        </>
    )
}
