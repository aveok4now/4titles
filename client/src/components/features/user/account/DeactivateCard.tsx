'use client'

import { Button } from '@/components/ui/common/button'
import { CardContainer } from '@/components/ui/elements/CardContainer'
import { ConfirmDialog } from '@/components/ui/elements/ConfirmDialog'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeactivateCard() {
    const t = useTranslations('dashboard.settings.account.deactivation')
    const router = useRouter()
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

    return (
        <CardContainer
            heading={t('heading')}
            description={t('description')}
            rightContent={
                <div className='flex items-center gap-x-4'>
                    <ConfirmDialog
                        heading={t('confirmModal.heading')}
                        message={t('confirmModal.message')}
                        open={isConfirmDialogOpen}
                        onOpenChange={setIsConfirmDialogOpen}
                        onConfirm={() => router.push('/account/deactivate')}
                    >
                        <Button variant='destructive'>{t('button')}</Button>
                    </ConfirmDialog>
                </div>
            }
        />
    )
}
