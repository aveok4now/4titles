'use client'

import { Form } from '@/components/ui/common/form'
import {
    EmailField,
    PasswordField,
    PinField,
} from '@/components/ui/elements/form-fields'
import { SubmitButton } from '@/components/ui/elements/SubmitButton'
import {
    DeactivateAccountMutation,
    useDeactivateAccountMutation,
} from '@/graphql/generated/output'
import { useAuth } from '@/hooks/useAuth'
import {
    deactivateAccountSchema,
    DeactivateAccountSchemaType,
} from '@/schemas/auth/deactivate-account.schema'
import { createFormNotificationHandlers } from '@/utils/form-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AuthWrapper } from '../AuthWrapper'

export function DeactivateForm() {
    const t = useTranslations('auth.deactivate')
    const router = useRouter()

    const { unauthorize } = useAuth()

    const [isShowConfirmationCode, setIsShowConfirmationCode] = useState(false)
    const [isConfirmationCodeValid, setIsConfirmationCodeValid] =
        useState(false)

    const form = useForm<DeactivateAccountSchemaType>({
        resolver: zodResolver(deactivateAccountSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onSubmit',
    })

    const { setFocus } = form

    useEffect(() => {
        if (isShowConfirmationCode) setFocus('pin')
    }, [isShowConfirmationCode, setFocus])

    const { handleSuccess: showSuccessMessage, handleError: showErrorMessage } =
        createFormNotificationHandlers({
            successMessage: t('successMessage'),
            errorMessage: isShowConfirmationCode
                ? t('confirmationCodeError')
                : t('credentialsValidationError'),
            errorDescription: isShowConfirmationCode
                ? t('confirmationCodeErrorDescription')
                : t('credentialsValidatonErrorDescription'),
        })

    const handleDeactivateSuccess = useCallback(
        (data: DeactivateAccountMutation) => {
            if (data.deactivateAccount.message) {
                setIsShowConfirmationCode(true)
            } else {
                unauthorize()
                showSuccessMessage()
                router.push('/')
            }
        },
        [showSuccessMessage, router],
    )

    const [deactivate, { loading: isLoadingDeactivate }] =
        useDeactivateAccountMutation({
            onCompleted: handleDeactivateSuccess,
            onError: showErrorMessage,
        })

    const isFormValid = isShowConfirmationCode
        ? isConfirmationCodeValid
        : form.formState.isValid

    const onSubmit = useCallback(
        (data: DeactivateAccountSchemaType) => {
            if (isFormValid) {
                deactivate({ variables: { data } })
            }
        },
        [isFormValid, deactivate],
    )

    const handlePinChange = useCallback((_: string, isValid: boolean) => {
        setIsConfirmationCodeValid(isValid)
    }, [])

    return (
        <AuthWrapper
            heading={t('heading')}
            backButtonLabel={t('backButtonLabel')}
            backButtonHref='/dashboard/settings'
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4'
                >
                    {isShowConfirmationCode ? (
                        <PinField
                            form={form}
                            name='pin'
                            label={t('pinLabel')}
                            description={t('pinDescription')}
                            onPinChange={handlePinChange}
                        />
                    ) : (
                        <>
                            <EmailField
                                form={form}
                                name='email'
                                label={t('emailLabel')}
                                description={t('emailDescription')}
                                disabled={isLoadingDeactivate}
                            />

                            <PasswordField
                                form={form}
                                name='password'
                                label={t('passwordLabel')}
                                description={t('passwordDescription')}
                                disabled={isLoadingDeactivate}
                            />
                        </>
                    )}
                    <SubmitButton
                        loading={isLoadingDeactivate}
                        disabled={!isFormValid}
                        label={t('submitButton')}
                    />
                </form>
            </Form>
        </AuthWrapper>
    )
}
