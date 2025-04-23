'use client'

import { Form } from '@/components/ui/common/form'
import { Link } from '@/components/ui/elements/Link'
import { SubmitButton } from '@/components/ui/elements/SubmitButton'
import {
    LoginAccountMutation,
    useLoginAccountMutation,
} from '@/graphql/generated/output'
import { useAuth } from '@/hooks/useAuth'
import { AUTH_ROUTES } from '@/libs/constants/auth.constants'
import {
    loginAccountSchema,
    LoginAccountSchemaType,
} from '@/schemas/auth/login.schema'
import { createFormNotificationHandlers } from '@/utils/form-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
    PasswordField,
    PinField,
    UsernameField,
} from '@/components/ui/elements/form-fields'
import { AuthWrapper } from '../AuthWrapper'

export function LoginForm() {
    const t = useTranslations('auth.login')
    const router = useRouter()

    const { authorize } = useAuth()

    const [isShowTwoFactor, setIsShowTwoFactor] = useState(false)
    const [isPinValid, setIsPinValid] = useState(false)

    const form = useForm<LoginAccountSchemaType>({
        resolver: zodResolver(loginAccountSchema),
        defaultValues: {
            login: '',
            password: '',
        },
        mode: 'onSubmit',
    })

    const { setFocus } = form

    useEffect(() => {
        if (isShowTwoFactor) setFocus('pin')
    }, [isShowTwoFactor, setFocus])

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
        (data: LoginAccountMutation) => {
            if (data.login.message) {
                setIsShowTwoFactor(true)
            } else {
                authorize()
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

    const isFormValid = isShowTwoFactor ? isPinValid : form.formState.isValid

    const onSubmit = useCallback(
        (data: LoginAccountSchemaType) => {
            if (isFormValid) {
                login({ variables: { data } })
            }
        },
        [isFormValid, login],
    )

    const handlePinChange = useCallback((_: string, isValid: boolean) => {
        setIsPinValid(isValid)
    }, [])

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
