'use client'

import { Button } from '@/components/ui/common/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/common/dialog'
import { Form } from '@/components/ui/common/form'
import { SubmitButton } from '@/components/ui/custom/content/submit-button'
import { PinField } from '@/components/ui/elements/form-fields'
import {
    useEnableTotpMutation,
    useGenerateTotpSecretQuery,
} from '@/graphql/generated/output'
import { useCurrent } from '@/hooks/useCurrent'
import {
    enableTotpSchema,
    EnableTotpSchemaType,
} from '@/schemas/user/enable-totp.schema'
import { createFormNotificationHandlers } from '@/utils/form-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

export function EnableTotp() {
    const t = useTranslations('dashboard.settings.account.twoFactor.enable')

    const [isOpen, setIsOpen] = useState(false)
    const { refetch } = useCurrent()

    const { data, loading: isLoadingGenerate } = useGenerateTotpSecretQuery()
    const twoFactorAuth = data?.generateTotpSecret

    const form = useForm<EnableTotpSchemaType>({
        resolver: zodResolver(enableTotpSchema),
        defaultValues: {
            pin: '',
        },
    })

    const { handleSuccess: showSuccessMessage, handleError: showErrorMessage } =
        createFormNotificationHandlers({
            successMessage: t('successMessage'),
            errorMessage: t('errorMessage'),
            errorDescription: t('errorMessageDescription'),
        })

    const [enable, { loading: isLoadingEnable }] = useEnableTotpMutation({
        onCompleted() {
            refetch()
            setIsOpen(false)
            showSuccessMessage()
        },
        onError() {
            showErrorMessage()
        },
    })

    const onSubmit = useCallback(
        (data: EnableTotpSchemaType) => {
            enable({
                variables: {
                    data: {
                        secret: twoFactorAuth?.secret ?? '',
                        pin: data.pin,
                    },
                },
            })
        },
        [enable, twoFactorAuth?.secret],
    )

    const { isValid } = form.formState

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant='secondary'>{t('trigger')}</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>{t('heading')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex flex-col gap-4'
                    >
                        <div className='flex flex-col items-center justify-center gap-4'>
                            <span className='text-sm text-muted-foreground'>
                                {twoFactorAuth?.qrCodeUrl
                                    ? t('qrInstructions')
                                    : ''}
                            </span>
                            <img
                                src={twoFactorAuth?.qrCodeUrl}
                                alt='QR'
                                className='max-w-full rounded-lg'
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <span className='break-all px-2 text-center text-sm text-muted-foreground'>
                                {twoFactorAuth?.secret
                                    ? t('secretCodeLabel') +
                                      twoFactorAuth.secret
                                    : ''}
                            </span>
                        </div>

                        <PinField
                            form={form}
                            name='pin'
                            label={t('pinLabel')}
                            description={t('pinDescription')}
                            className='flex w-full flex-col items-center justify-center'
                        />

                        <DialogFooter className='mt-2 flex flex-col sm:flex-row'>
                            <SubmitButton
                                label={t('submitButton')}
                                disabled={
                                    !isValid ||
                                    isLoadingGenerate ||
                                    isLoadingEnable
                                }
                                className='w-full sm:w-auto'
                            />
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
