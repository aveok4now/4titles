'use client'

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/common/dialog'
import { Map } from '@/components/ui/elements/map'
import { FindSessionsByUserQuery } from '@/graphql/generated/output'
import { formatDate } from '@/utils/format-date'
import { getSessionDisplayData } from '@/utils/session-utils'
import { MapStyle } from '@maptiler/sdk'
import { useLocale, useTranslations } from 'next-intl'
import { PropsWithChildren } from 'react'
import { SessionInfoItem } from './SessionInfoItem'

interface SessionModalProps {
    session: FindSessionsByUserQuery['findSessionsByUser'][0]
}

export function SessionModal({
    children,
    session,
}: PropsWithChildren<SessionModalProps>) {
    const t = useTranslations('dashboard.settings.sessions.sessionModal')
    const locale = useLocale()

    const { deviceInfo, locationInfo, location } = getSessionDisplayData(
        session,
        locale,
    )

    const sessionDetails = [
        { label: t('device'), value: deviceInfo },
        {
            label: t('location'),
            value: locationInfo,
        },
        { label: t('ipAddress'), value: session.metadata.ip },
        { label: t('createdAt'), value: formatDate(session.createdAt, true) },
    ]

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogTitle className='text-xl'>{t('heading')}</DialogTitle>
                <div className='space-y-2'>
                    {sessionDetails.map((item, index) => (
                        <SessionInfoItem
                            key={index}
                            label={item.label}
                            value={item.value}
                        />
                    ))}
                    <Map
                        markers={[
                            {
                                coordinates: location,
                            },
                        ]}
                        center={location}
                        zoom={4}
                        height={300}
                        style={MapStyle.OUTDOOR}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
