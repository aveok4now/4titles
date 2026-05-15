'use client'

import { Form } from '@/components/ui/common/form'
import { Separator } from '@/components/ui/common/separator'
import { SubmitButton } from '@/components/ui/elements/SubmitButton'
import { useNewPasswordMutation } from '@/graphql/generated/output'
import { useFormValidation } from '@/hooks/useFormValidation'
import { AUTH_ROUTES } from '@/libs/constants/auth.constants'
import {
    newPasswordSchema,
    NewPasswordSchemaMessages,
    NewPasswordSchemaType,
} from '@/schemas/auth/new-password.schema'
import { createFormNotificationHandlers } from '@/utils/form-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { PasswordField } from '../../../ui/elements/form-fields'
import { AuthWrapper } from '../AuthWrapper'

export function NewPasswordForm() {
    const t = useTranslations('auth.recovery.newPassword')
    const router = useRouter()
    const params = useParams<{ token: string }>()

    const validationMessages: NewPasswordSchemaMessages = {
        passwordMinLengthValidationError: t('passwordMinLengthValidationError'),
        passwordWeaknessError: t('passwordWeaknessError'),
        passwordRepeatError: t('passwordRepeatError'),
    }

    const form = useForm<NewPasswordSchemaType>({
        resolver: zodResolver(newPasswordSchema(validationMessages)),
        defaultValues: {
            password: '',
            passwordRepeat: '',
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

    const { handleSuccess, handleError } = createFormNotificationHandlers({
        successMessage: t('successMessage'),
        errorMessage: t('errorMessage'),
        errorDescription: t('errorMessageDescription'),
    })

    const handleResetSuccess = useCallback(() => {
        handleSuccess()
        router.push(AUTH_ROUTES.LOGIN)
    }, [handleSuccess, router])

    const [newPassword, { loading: isLoadingNewPassword }] =
        useNewPasswordMutation({
            onCompleted: handleResetSuccess,
            onError: () => {
                handleError()
                resetSubmitState()
            },
        })

    const onSubmit = useCallback(
        (data: NewPasswordSchemaType) => {
            setIsSubmitted(true)
            if (form.formState.isValid) {
                newPassword({
                    variables: { data: { ...data, token: params.token } },
                })
            }
        },
        [setIsSubmitted, form.formState.isValid, newPassword, params.token],
    )

    return (
        <AuthWrapper
            heading={t('heading')}
            backButtonQuestion={t('backButtonQuestion')}
            backButtonLabel={t('backButtonLabel')}
            backButtonHref={AUTH_ROUTES.LOGIN}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onSubmitCapture={handleFormSubmit}
                    className='space-y-4'
                    noValidate
                >
                    <PasswordField
                        form={form}
                        name='password'
                        label={t('passwordLabel')}
                        disabled={isLoadingNewPassword}
                        autoComplete='new-password'
                        shouldShowErrors
                    />

                    <PasswordField
                        form={form}
                        name='passwordRepeat'
                        label={t('passwordRepeatLabel')}
                        disabled={isLoadingNewPassword}
                        shouldShowErrors
                    />

                    <Separator />

                    <SubmitButton
                        loading={isLoadingNewPassword}
                        disabled={isEmptyFormDisabled(isLoadingNewPassword)}
                        label={t('submitButton')}
                    />
                </form>
            </Form>
        </AuthWrapper>
    )
}
