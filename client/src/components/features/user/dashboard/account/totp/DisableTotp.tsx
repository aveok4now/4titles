'use client'

import { Button } from '@/components/ui/common/button'
import { ConfirmDialog } from '@/components/ui/elements/ConfirmDialog'
import { useDisableTotpMutation } from '@/graphql/generated/output'
import { useCurrent } from '@/hooks/useCurrent'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

export function DisableTotp() {
    const t = useTranslations('dashboard.settings.account.twoFactor.disable')

    const { refetch } = useCurrent()

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

    const [disable, { loading: isLoadingDisable }] = useDisableTotpMutation({
        onCompleted() {
            refetch()
            toast.success(t('successMessage'))
        },
        onError() {
            toast.error(t('errorMessage'))
        },
    })

    return (
        <ConfirmDialog
            open={isConfirmDialogOpen}
            onOpenChange={setIsConfirmDialogOpen}
            heading={t('heading')}
            message={t('message')}
            onConfirm={() => disable()}
        >
            <Button variant='destructive' disabled={isLoadingDisable}>
                {t('trigger')}
            </Button>
        </ConfirmDialog>
    )
}
