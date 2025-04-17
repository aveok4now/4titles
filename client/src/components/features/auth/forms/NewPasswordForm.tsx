'use client'

import { Button } from '@/components/ui/common/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/common/form'
import { Separator } from '@/components/ui/common/separator'
import { PasswordInput } from '@/components/ui/custom/password-input'
import { Spinner } from '@/components/ui/custom/spinner'
import { AUTH_ROUTES } from '@/constants/auth'
import { useNewPasswordMutation } from '@/graphql/generated/output'
import { useFormValidation } from '@/hooks/useFormValidation'
import {
    newPasswordSchema,
    NewPasswordSchemaMessages,
    NewPasswordSchemaType,
} from '@/schemas/auth/new-password.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
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
        shouldShowErrors,
        resetSubmitState,
        isEmptyFormDisabled,
    } = useFormValidation(form)

    const handleSuccess = useCallback(() => {
        toast.success(t('successMessage'))
        router.push(AUTH_ROUTES.LOGIN)
    }, [t, router])

    const handleError = useCallback(() => {
        toast.error(t('errorMessage'), {
            description: t('errorMessageDescription'),
        })
        resetSubmitState()
    }, [t, resetSubmitState])

    const [newPassword, { loading: isLoadingNewPassword }] =
        useNewPasswordMutation({
            onCompleted: handleSuccess,
            onError: handleError,
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
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('passwordLabel')}</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        placeholder='********'
                                        disabled={isLoadingNewPassword}
                                        autoComplete='new-password'
                                        {...field}
                                    />
                                </FormControl>
                                <div className='h-3.5 md:h-1'>
                                    {shouldShowErrors && (
                                        <FormMessage className='text-xs' />
                                    )}
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='passwordRepeat'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t('passwordRepeatLabel')}
                                </FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        placeholder='********'
                                        disabled={isLoadingNewPassword}
                                        {...field}
                                    />
                                </FormControl>
                                <div className='h-3.5 md:h-1'>
                                    {shouldShowErrors && (
                                        <FormMessage className='text-xs' />
                                    )}
                                </div>
                            </FormItem>
                        )}
                    />

                    <Separator />

                    <Button
                        type='submit'
                        className='h-11 w-full'
                        disabled={isEmptyFormDisabled(isLoadingNewPassword)}
                    >
                        {isLoadingNewPassword ? <Spinner /> : t('submitButton')}
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}
