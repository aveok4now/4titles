'use client'

import { Form } from '@/components/ui/common/form'
import { Link } from '@/components/ui/custom/link'
import { SubmitButton } from '@/components/ui/custom/submit-button'
import { AUTH_ROUTES } from '@/constants/auth'
import { useLoginAccountMutation } from '@/graphql/generated/output'
import {
    loginAccountSchema,
    LoginAccountSchemaType,
} from '@/schemas/auth/login.schema'
import { createFormNotificationHandlers } from '@/utils/form-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AuthWrapper } from '../AuthWrapper'
import { PasswordField, PinField, UsernameField } from './fields'

export function LoginForm() {
    const t = useTranslations('auth.login')
    const router = useRouter()

    const [isShowTwoFactor, setIsShowTwoFactor] = useState(false)
    const [isPinValid, setIsPinValid] = useState(false)
    const otpRef = useRef<HTMLDivElement>(null)

    const form = useForm<LoginAccountSchemaType>({
        resolver: zodResolver(loginAccountSchema),
        defaultValues: {
            login: '',
            password: '',
        },
        mode: 'onSubmit',
    })

    useEffect(() => {
        if (isShowTwoFactor && otpRef.current) {
            const input = otpRef.current.querySelector('input')
            if (input) {
                input.focus()
            }
        }
    }, [isShowTwoFactor])

    const { handleSuccess, handleError } = createFormNotificationHandlers({
        successMessage: t('successMessage'),
        errorMessage: isShowTwoFactor
            ? t('totpValidationError')
            : t('credentialsValidationError'),
        errorDescription: isShowTwoFactor
            ? t('totpValidationErrorDescription')
            : t('credentialsValidatonErrorDescription'),
    })

    const handleLoginSuccess = useCallback(
        (data: any) => {
            if (data.login.message) {
                setIsShowTwoFactor(true)
            } else {
                handleSuccess()
                router.push(AUTH_ROUTES.AFTER_LOGIN)
            }
        },
        [handleSuccess, router],
    )

    const [login, { loading: isLoadingLogin }] = useLoginAccountMutation({
        onCompleted: handleLoginSuccess,
        onError: handleError,
    })

    const handlePinChange = useCallback((pin: string, isValid: boolean) => {
        setIsPinValid(isValid)
    }, [])

    const isFormValid = isShowTwoFactor ? isPinValid : form.formState.isValid

    const onSubmit = useCallback(
        (data: LoginAccountSchemaType) => {
            if (isFormValid) {
                login({ variables: { data } })
            }
        },
        [isFormValid, login],
    )

    return (
        <AuthWrapper
            heading={t('heading')}
            backButtonQuestion={t('backButtonQuestion')}
            backButtonLabel={t('backButtonLabel')}
            backButtonHref={AUTH_ROUTES.REGISTER}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4'
                >
                    {isShowTwoFactor ? (
                        <PinField
                            form={form}
                            name='pin'
                            label={t('pinLabel')}
                            description={t('pinDescription')}
                            onPinChange={handlePinChange}
                            otpRef={otpRef}
                        />
                    ) : (
                        <>
                            <UsernameField
                                form={form}
                                name='login'
                                label={t('loginLabel')}
                                disabled={isLoadingLogin}
                            />

                            <PasswordField
                                form={form}
                                name='password'
                                label={t('passwordLabel')}
                                disabled={isLoadingLogin}
                                action={
                                    <Link href={AUTH_ROUTES.RECOVERY}>
                                        {t('forgotPassword')}
                                    </Link>
                                }
                            />
                        </>
                    )}

                    <SubmitButton
                        loading={isLoadingLogin}
                        disabled={!isFormValid}
                        label={t('submitButton')}
                    />
                </form>
            </Form>
        </AuthWrapper>
    )
}
