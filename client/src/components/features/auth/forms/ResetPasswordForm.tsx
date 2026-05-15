'use client'

import { Form } from '@/components/ui/common/form'
import { Separator } from '@/components/ui/common/separator'
import { SubmitButton } from '@/components/ui/elements/SubmitButton'
import { useResetPasswordMutation } from '@/graphql/generated/output'
import { useFormValidation } from '@/hooks/useFormValidation'
import { AUTH_ROUTES } from '@/libs/constants/auth.constants'
import {
    resetPasswordSchema,
    ResetPasswordSchemaMessages,
    ResetPasswordSchemaType,
} from '@/schemas/auth/reset-password.schema'
import { createFormNotificationHandlers } from '@/utils/form-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { EmailField } from '../../../ui/elements/form-fields'
import { AuthFeedback } from '../AuthFeedback'
import { AuthWrapper } from '../AuthWrapper'

export function ResetPasswordForm() {
    const t = useTranslations('auth.recovery.resetPassword')
    const [isSuccess, setIsSuccess] = useState(false)

    const validationMessages: ResetPasswordSchemaMessages = {
        emailValidationError: t('emailValidationError'),
    }

    const form = useForm<ResetPasswordSchemaType>({
        resolver: zodResolver(resetPasswordSchema(validationMessages)),
        defaultValues: {
            email: '',
        },
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    })

    const {
        setIsSubmitted,
        handleFormSubmit,
        resetSubmitState,
        isEmptyFormDisabled,
    } = useFormValidation(form)

    const { handleError } = createFormNotificationHandlers({
        errorMessage: t('errorMessage'),
        errorDescription: t('errorMessageDescription'),
    })

    const handleResetSuccess = useCallback(() => {
        setIsSuccess(true)
    }, [])

    const [resetPassword, { loading: isLoadingPasswordReset }] =
        useResetPasswordMutation({
            onCompleted: handleResetSuccess,
            onError: () => {
                handleError()
                resetSubmitState()
            },
        })

    const onSubmit = useCallback(
        (data: ResetPasswordSchemaType) => {
            setIsSubmitted(true)
            if (form.formState.isValid) {
                resetPassword({ variables: { data } })
            }
        },
        [setIsSubmitted, form.formState.isValid, resetPassword],
    )

    return (
        <AuthWrapper
            heading={t('heading')}
            backButtonQuestion={t('backButtonQuestion')}
            backButtonLabel={t('backButtonLabel')}
            backButtonHref={AUTH_ROUTES.LOGIN}
        >
            {isSuccess ? (
                <AuthFeedback
                    title={t('successAlertTitle')}
                    description={t('successAlertDescription')}
                />
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        onSubmitCapture={handleFormSubmit}
                        className='space-y-4'
                        noValidate
                    >
                        <EmailField
                            form={form}
                            name='email'
                            label={t('emailLabel')}
                            disabled={isLoadingPasswordReset}
                            description={t('emailFieldDescription')}
                            shouldShowErrors
                        />

                        <Separator />

                        <SubmitButton
                            loading={isLoadingPasswordReset}
                            disabled={isEmptyFormDisabled(
                                isLoadingPasswordReset,
                            )}
                            label={t('submitButton')}
                        />
                    </form>
                </Form>
            )}
        </AuthWrapper>
    )
}
