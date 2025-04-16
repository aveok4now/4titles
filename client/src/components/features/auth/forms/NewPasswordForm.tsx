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
import { useNewPasswordMutation } from '@/graphql/generated/output'
import { useFormValidation } from '@/hooks/useFormValidation'
import {
    newPasswordSchema,
    NewPasswordSchemaType,
} from '@/schemas/auth/new-password.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AuthWrapper } from '../AuthWrapper'

export function NewPasswordForm() {
    const t = useTranslations('auth.recovery.newPassword')
    const router = useRouter()
    const params = useParams<{ token: string }>()

    const form = useForm<NewPasswordSchemaType>({
        resolver: zodResolver(
            newPasswordSchema({
                passwordMinLengthValidationError: t(
                    'passwordMinLengthValidationError',
                ),
                passwordWeaknessError: t('passwordWeaknessError'),
                passwordRepeatError: t('passwordRepeatError'),
            }),
        ),
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
        isSubmitDisabled,
    } = useFormValidation(form)

    const [newPassword, { loading: isLoadingNewPassword }] =
        useNewPasswordMutation({
            onCompleted() {
                toast.success(t('successMessage'))
                router.push('/account/login')
            },
            onError() {
                toast.error(t('errorMessage'), {
                    description: t('errorMessageDescription'),
                })
            },
        })

    async function onSubmit(data: NewPasswordSchemaType) {
        setIsSubmitted(true)
        if (form.formState.isValid) {
            newPassword({
                variables: { data: { ...data, token: params.token } },
            })
        }
    }

    return (
        <AuthWrapper
            heading={t('heading')}
            backButtonQuestion={t('backButtonQuestion')}
            backButtonLabel={t('backButtonLabel')}
            backButtonHref='/account/login'
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onSubmitCapture={handleFormSubmit}
                    className='space-y-4'
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
                        disabled={isSubmitDisabled(isLoadingNewPassword)}
                    >
                        {isLoadingNewPassword ? <Spinner /> : t('submitButton')}
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}
