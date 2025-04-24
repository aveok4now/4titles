'use client'

import { Heading } from '@/components/ui/elements/Heading'
import { ToggleCardSkeleton } from '@/components/ui/elements/ToggleCard'
import {
    useFindCurrentSessionQuery,
    useFindSessionsByUserQuery,
} from '@/graphql/generated/output'
import { useTranslations } from 'next-intl'
import { SessionItem } from './SessionItem'

export function SessionsList() {
    const t = useTranslations('dashboard.settings.sessions')

    const { data: sessionData, loading: isLoadingCurrent } =
        useFindCurrentSessionQuery()
    const currentSession = sessionData?.findCurrentSession!

    const { data: sessionsData, loading: isLoadingSessions } =
        useFindSessionsByUserQuery()
    const sessions = sessionsData?.findSessionsByUser ?? []

    const activeSessions = sessions.filter(
        session => session.id !== currentSession.id,
    )

    return (
        <div className='space-y-4'>
            <Heading title={t('info.current')} size='sm' />
            {isLoadingCurrent ? (
                <ToggleCardSkeleton />
            ) : (
                <SessionItem session={currentSession} isCurrentSession />
            )}
            <Heading
                title={t('info.active')}
                description={
                    !activeSessions.length ? t('info.notFound') : undefined
                }
                size='sm'
            />
            {isLoadingSessions
                ? Array.from({ length: 3 }).map((_, index) => (
                      <ToggleCardSkeleton key={index} />
                  ))
                : activeSessions.length > 0 &&
                  sessions.map((session, index) => (
                      <SessionItem key={index} session={session} />
                  ))}
        </div>
    )
}
