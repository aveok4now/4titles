'use client'

import { Button } from '@/components/ui/common/button'
import { Form } from '@/components/ui/common/form'
import { Separator } from '@/components/ui/common/separator'
import { Skeleton } from '@/components/ui/common/skeleton'
import { FormWrapper } from '@/components/ui/elements/FormWrapper'
import { useChangeEmailMutation } from '@/graphql/generated/output'
import { useCurrent } from '@/hooks/useCurrent'
import {
    changeEmailSchema,
    ChangeEmailSchemaType,
} from '@/schemas/user/change-email.schema'
import { createFormNotificationHandlers } from '@/utils/form-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { EmailField } from '../../../../ui/elements/form-fields'

export function ChangeEmailForm() {
    const t = useTranslations('dashboard.settings.account.email')

    const { profile, isLoadingProfile, refetch } = useCurrent()

    const form = useForm<ChangeEmailSchemaType>({
        resolver: zodResolver(changeEmailSchema),
        values: {
            email: profile?.email ?? '',
        },
    })

    const { handleSuccess: showSuccessMessage, handleError: showErrorMessage } =
        createFormNotificationHandlers({
            successMessage: t('successMessage'),
            errorMessage: t('errorMessage'),
        })

    const [update, { loading: isLoadingUpdate }] = useChangeEmailMutation({
        onCompleted() {
            refetch()
            showSuccessMessage()
        },
        onError() {
            showErrorMessage()
        },
    })

    const { isValid, isDirty } = form.formState

    const onSubmit = useCallback(
        (data: ChangeEmailSchemaType) => {
            update({ variables: { data } })
        },
        [update],
    )

    return isLoadingProfile ? (
        <ChangeEmailFormSkeleton />
    ) : (
        <FormWrapper heading={t('heading')}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='grid gap-y-3'
                >
                    <EmailField
                        form={form}
                        name='email'
                        label={t('emailLabel')}
                        className='px-5'
                        disabled={isLoadingUpdate}
                        description={t('emailDescription')}
                    />

                    <Separator />

                    <div className='flex justify-end p-5'>
                        <Button
                            disabled={!isValid || !isDirty || isLoadingUpdate}
                            variant='secondary'
                            type='submit'
                        >
                            {t('submitButton')}
                        </Button>
                    </div>
                </form>
            </Form>
        </FormWrapper>
    )
}

export function ChangeEmailFormSkeleton() {
    return <Skeleton className='h-64 w-full' />
}
