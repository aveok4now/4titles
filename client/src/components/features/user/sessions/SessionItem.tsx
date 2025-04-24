'use client'

import { Button } from '@/components/ui/common/button'
import { CardContainer } from '@/components/ui/elements/CardContainer'
import { ConfirmDialog } from '@/components/ui/elements/ConfirmDialog'
import { Hint } from '@/components/ui/elements/Hint'
import {
    FindSessionsByUserQuery,
    useFindSessionsByUserQuery,
    useRemoveSessionMutation,
} from '@/graphql/generated/output'
import { createFormNotificationHandlers } from '@/utils/form-notifications'
import { getBrowserIcon } from '@/utils/get-browser-icon'
import { getSessionDisplayData } from '@/utils/session-utils'
import { LogOut } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { SessionModal } from './SessionModal'

interface SessionItemProps {
    session: FindSessionsByUserQuery['findSessionsByUser'][0]
    isCurrentSession?: boolean
}

export function SessionItem({ session, isCurrentSession }: SessionItemProps) {
    const t = useTranslations('dashboard.settings.sessions.sessionItem')
    const locale = useLocale()

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

    const { refetch } = useFindSessionsByUserQuery()

    const { handleSuccess: showSuccessMessage, handleError: showErrorMessage } =
        createFormNotificationHandlers({
            successMessage: t('successMessage'),
            errorMessage: t('errorMessage'),
        })

    const [remove, { loading: isLoadingRemove }] = useRemoveSessionMutation({
        onCompleted() {
            refetch()
            showSuccessMessage()
        },
        onError() {
            showErrorMessage()
        },
    })

    const handleRemoveSession = useCallback(() => {
        remove({ variables: { id: session.id } })
    }, [remove, session.id])

    const Icon = getBrowserIcon(session.metadata.device.browser)
    const { deviceInfo, locationInfo } = getSessionDisplayData(session, locale)

    return (
        <CardContainer
            heading={deviceInfo}
            description={locationInfo}
            Icon={Icon}
            rightContent={
                <div className='flex items-center gap-x-3'>
                    <SessionModal session={session}>
                        <Button variant='secondary'>
                            {t('detailsButton')}
                        </Button>
                    </SessionModal>

                    {!isCurrentSession && (
                        <>
                            <Hint label={t('deleteButton')} side='bottom'>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    disabled={isLoadingRemove}
                                    onClick={() => setIsConfirmDialogOpen(true)}
                                >
                                    <LogOut className='size-4' />
                                </Button>
                            </Hint>

                            <ConfirmDialog
                                open={isConfirmDialogOpen}
                                onOpenChange={setIsConfirmDialogOpen}
                                heading={t('confirmDialog.heading')}
                                message={t('confirmDialog.message')}
                                onConfirm={handleRemoveSession}
                            />
                        </>
                    )}
                </div>
            }
        />
    )
}
