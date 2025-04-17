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
import { PasswordInput } from '@/components/ui/custom/password-input'
import { Spinner } from '@/components/ui/custom/spinner'
import { AUTH_ROUTES } from '@/constants/auth'
import { useCreateAccountMutation } from '@/graphql/generated/output'
import { useFormValidation } from '@/hooks/useFormValidation'
import {
    createAccountSchema,
    CreateAccountSchemaMessages,
    CreateAccountSchemaType,
} from '@/schemas/auth/create-account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AuthFeedback } from '../AuthFeedback'
import { AuthWrapper } from '../AuthWrapper'

export function CreateAccountForm() {
    const t = useTranslations('auth.register')
    const [isSuccess, setIsSuccess] = useState(false)

    const validationMessages: CreateAccountSchemaMessages = {
        usernameMinLengthValidationError: t('usernameMinLengthValidationError'),
        usernameInvalidCharactersValidationError: t(
            'usernameInvalidCharactersValidationError',
        ),
        emailValidationError: t('emailValidationError'),
        passwordMinLengthValidationError: t('passwordMinLengthValidationError'),
        passwordWeaknessError: t('passwordWeaknessError'),
    }

    const form = useForm<CreateAccountSchemaType>({
        resolver: zodResolver(createAccountSchema(validationMessages)),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
        mode: 'onSubmit',
        reValidateMode: 'onChange',
    })

    const {
        setIsSubmitted,
        handleFormSubmit,
        shouldShowErrors,
        isSubmitDisabled,
        resetSubmitState,
    } = useFormValidation(form)

    const handleCreateSuccess = useCallback(() => {
        setIsSuccess(true)
    }, [])

    const handleCreateError = useCallback(() => {
        toast.error(t('serverErrorMessage'))
        resetSubmitState()
    }, [t, resetSubmitState])

    const [create, { loading: isAccountCreating }] = useCreateAccountMutation({
        onCompleted: handleCreateSuccess,
        onError: handleCreateError,
    })

    const onSubmit = useCallback(
        (input: CreateAccountSchemaType) => {
            setIsSubmitted(true)
            if (form.formState.isValid) {
                create({ variables: { input } })
            }
        },
        [setIsSubmitted, form.formState.isValid, create],
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
                    >
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem className='space-y-1.5'>
                                    <FormLabel>{t('usernameLabel')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='nostylist44'
                                            disabled={isAccountCreating}
                                            autoComplete='username'
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
                            name='email'
                            render={({ field }) => (
                                <FormItem className='space-y-1.5'>
                                    <FormLabel>{t('emailLabel')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='email'
                                            placeholder='nostylist@gmail.com'
                                            disabled={isAccountCreating}
                                            autoComplete='email'
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
                            name='password'
                            render={({ field }) => (
                                <FormItem className='space-y-1.5'>
                                    <FormLabel>{t('passwordLabel')}</FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            placeholder='********'
                                            disabled={isAccountCreating}
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

                        <Separator />

                        <Button
                            type='submit'
                            className='h-11 w-full'
                            disabled={isSubmitDisabled(isAccountCreating)}
                        >
                            {isAccountCreating ? (
                                <Spinner />
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
