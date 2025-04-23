'use client'

import { Form } from '@/components/ui/common/form'
import { Separator } from '@/components/ui/common/separator'
import { SubmitButton } from '@/components/ui/elements/SubmitButton'
import { useCreateAccountMutation } from '@/graphql/generated/output'
import { useFormValidation } from '@/hooks/useFormValidation'
import { AUTH_ROUTES } from '@/libs/constants/auth.constants'
import {
    createAccountSchema,
    CreateAccountSchemaMessages,
    CreateAccountSchemaType,
} from '@/schemas/auth/create-account.schema'
import { createFormNotificationHandlers } from '@/utils/form-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
    EmailField,
    PasswordField,
    UsernameField,
} from '../../../ui/elements/form-fields'
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
        isSubmitDisabled,
        resetSubmitState,
    } = useFormValidation(form)

    const { handleError } = createFormNotificationHandlers({
        errorMessage: t('serverErrorMessage'),
    })

    const handleCreateSuccess = useCallback(() => {
        setIsSuccess(true)
    }, [])

    const [create, { loading: isAccountCreating }] = useCreateAccountMutation({
        onCompleted: handleCreateSuccess,
        onError: () => {
            handleError()
            resetSubmitState()
        },
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
                        noValidate
                    >
                        <UsernameField
                            form={form}
                            name='username'
                            label={t('usernameLabel')}
                            disabled={isAccountCreating}
                            shouldShowErrors
                        />

                        <EmailField
                            form={form}
                            name='email'
                            label={t('emailLabel')}
                            disabled={isAccountCreating}
                            shouldShowErrors
                        />

                        <PasswordField
                            form={form}
                            name='password'
                            label={t('passwordLabel')}
                            disabled={isAccountCreating}
                            autoComplete='new-password'
                            shouldShowErrors
                        />

                        <Separator />

                        <SubmitButton
                            loading={isAccountCreating}
                            disabled={isSubmitDisabled(isAccountCreating)}
                            label={t('submitButton')}
                        />
                    </form>
                </Form>
            )}
        </AuthWrapper>
    )
}
