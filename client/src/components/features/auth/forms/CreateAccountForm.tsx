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
import { Input } from '@/components/ui/common/input'
import { Separator } from '@/components/ui/common/separator'
import FadeContent from '@/components/ui/custom/content/fade-content'
import { PasswordInput } from '@/components/ui/custom/password-input'
import BlurText from '@/components/ui/custom/text/blur-text'
import { useCreateAccountMutation } from '@/graphql/generated/output'
import {
    createAccountSchema,
    CreateAccountSchemaType,
} from '@/schemas/auth/create-account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AuthWrapper } from '../AuthWrapper'

export function CreateAccountForm() {
    const t = useTranslations('auth.register')

    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const form = useForm<CreateAccountSchemaType>({
        resolver: zodResolver(
            createAccountSchema({
                usernameMinLengthValidationError: t(
                    'usernameMinLengthValidationError',
                ),
                usernameInvalidCharactersValidationError: t(
                    'usernameInvalidCharactersValidationError',
                ),
                emailValidationError: t('emailValidationError'),
                passwordMinLengthValidationError: t(
                    'passwordMinLengthValidationError',
                ),
                passwordWeaknessError: t('passwordWeaknessError'),
            }),
        ),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    })

    const [create, { loading: isAccountCreating }] = useCreateAccountMutation({
        onCompleted() {
            setIsSuccess(true)
        },
        onError() {
            toast.error(t('serverErrorMessage'), {
                position: 'top-center',
                duration: 2000,
            })
        },
    })

    const { isValid } = form.formState

    async function onSubmit(input: CreateAccountSchemaType) {
        setIsSubmitted(true)
        if (isValid) {
            create({ variables: { input } })
        }
    }

    return (
        <AuthWrapper
            heading={t('heading')}
            backButtonQuestion={t('backButtonQuestion')}
            backButtonLabel={t('backButtonLabel')}
            backButtonHref='/account/login'
        >
            {isSuccess ? (
                <div className='flex flex-col items-center gap-4 py-4 text-center'>
                    <BlurText
                        className='text-md font-semibold text-foreground md:text-xl'
                        text={t('successAlertTitle')}
                        delay={100}
                    />
                    <FadeContent delay={125} duration={1500} blur={true}>
                        <p className='max-w-fit text-sm text-muted-foreground'>
                            {t('successAlertDescription')}
                        </p>
                    </FadeContent>
                </div>
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem className='space-y-1.5'>
                                    <FormLabel className='text-sm font-medium text-foreground'>
                                        {t('usernameLabel')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='username'
                                            disabled={isAccountCreating}
                                            {...field}
                                        />
                                    </FormControl>
                                    <div className='h-3.5 md:h-2.5'>
                                        <FormMessage className='text-xs' />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem className='space-y-1.5'>
                                    <FormLabel className='text-sm font-medium text-foreground'>
                                        {t('emailLabel')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type='email'
                                            placeholder='example@example.com'
                                            disabled={isAccountCreating}
                                            {...field}
                                        />
                                    </FormControl>
                                    <div className='h-3.5 md:h-2.5'>
                                        <FormMessage className='text-xs' />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem className='space-y-1.5'>
                                    <FormLabel className='text-sm font-medium text-foreground'>
                                        {t('passwordLabel')}
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            placeholder='********'
                                            disabled={isAccountCreating}
                                            {...field}
                                        />
                                    </FormControl>
                                    <div className='h-3.5 md:h-2.5'>
                                        <FormMessage className='text-xs' />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <Separator />

                        <Button
                            type='submit'
                            className='mt-4 h-11 w-full bg-primary font-medium text-primary-foreground hover:bg-primary/90'
                            disabled={
                                isAccountCreating || (isSubmitted && !isValid)
                            }
                        >
                            {isAccountCreating ? (
                                <div className='h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-primary-foreground'></div>
                            ) : (
                                t('submitButton')
                            )}
                        </Button>
                    </form>
                </Form>
            )}
        </AuthWrapper>
    )
}
