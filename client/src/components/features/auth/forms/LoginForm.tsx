'use client'

import { Button } from '@/components/ui/common/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/common/form'
import { Input } from '@/components/ui/common/input'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/common/input-otp'
import { Link } from '@/components/ui/custom/link'
import { PasswordInput } from '@/components/ui/custom/password-input'
import { Spinner } from '@/components/ui/custom/spinner'
import { useLoginAccountMutation } from '@/graphql/generated/output'
import {
    loginAccountSchema,
    LoginAccountSchemaType,
} from '@/schemas/auth/login.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AuthWrapper } from '../AuthWrapper'

export function LoginForm() {
    const t = useTranslations('auth.login')
    const router = useRouter()

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

    useEffect(() => {
        if (isShowTwoFactor) {
            const pinValue = form.watch('pin')
            setIsPinValid(pinValue?.length === 6)
        }
    }, [form.watch('pin'), isShowTwoFactor])

    const [login, { loading: isLoadingLogin }] = useLoginAccountMutation({
        onCompleted(data) {
            if (data.login.message) {
                setIsShowTwoFactor(true)
            } else {
                toast.success(t('successMessage'))
                router.push('/')
            }
        },
        onError() {
            const formValues = form.getValues()

            if (formValues.pin) {
                toast.error(t('totpValidationError'), {
                    description: t('totpValidationErrorDescription'),
                })
            } else {
                toast.error(t('credentialsValidationError'), {
                    description: t('credentialsValidatonErrorDescription'),
                })
            }
        },
    })

    const isFormValid = isShowTwoFactor ? isPinValid : form.formState.isValid

    async function onSubmit(data: LoginAccountSchemaType) {
        if (isFormValid) {
            login({ variables: { data } })
        }
    }

    return (
        <AuthWrapper
            heading={t('heading')}
            backButtonQuestion={t('backButtonQuestion')}
            backButtonLabel={t('backButtonLabel')}
            backButtonHref='/account/create'
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4'
                >
                    {isShowTwoFactor ? (
                        <FormField
                            control={form.control}
                            name='pin'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('pinLabel')}</FormLabel>
                                    <FormControl>
                                        <InputOTP
                                            maxLength={6}
                                            pattern={REGEXP_ONLY_DIGITS}
                                            {...field}
                                            onChange={value => {
                                                field.onChange(value)
                                                setIsPinValid(
                                                    value.length === 6,
                                                )
                                            }}
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormDescription>
                                        {t('pinDescription')}
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    ) : (
                        <>
                            <FormField
                                control={form.control}
                                name='login'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('loginLabel')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='nostylist44'
                                                disabled={isLoadingLogin}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='flex items-center justify-center'>
                                            <FormLabel>
                                                {t('passwordLabel')}
                                            </FormLabel>
                                            <Link
                                                href='/account/recovery'
                                                className='ml-auto inline-block'
                                            >
                                                {t('forgotPassword')}
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <PasswordInput
                                                placeholder='********'
                                                disabled={isLoadingLogin}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </>
                    )}

                    <Button
                        type='submit'
                        className='h-11 w-full'
                        disabled={isLoadingLogin || !isFormValid}
                    >
                        {isLoadingLogin ? <Spinner /> : t('submitButton')}
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}
