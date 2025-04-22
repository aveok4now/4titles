import { Button } from '@/components/ui/common/button'
import { Form } from '@/components/ui/common/form'
import { Separator } from '@/components/ui/common/separator'
import { Skeleton } from '@/components/ui/common/skeleton'
import { FormWrapper } from '@/components/ui/elements/FormWrapper'
import { useChangePasswordMutation } from '@/graphql/generated/output'
import { useCurrent } from '@/hooks/useCurrent'
import {
    changePasswordSchema,
    ChangePasswordSchemaType,
} from '@/schemas/user/change-password.schema'
import { createFormNotificationHandlers } from '@/utils/form-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { PasswordField } from '../../../ui/elements/form-fields'

export function ChangePasswordForm() {
    const t = useTranslations('dashboard.settings.account.password')

    const { isLoadingProfile, refetch } = useCurrent()

    const form = useForm<ChangePasswordSchemaType>({
        resolver: zodResolver(changePasswordSchema),
        values: {
            oldPassword: '',
            newPassword: '',
        },
    })

    const { handleSuccess: showSuccessMessage, handleError: showErrorMessage } =
        createFormNotificationHandlers({
            successMessage: t('successMessage'),
            errorMessage: t('errorMessage'),
            errorDescription: t('errorMessageDescription'),
        })

    const [update, { loading: isLoadingUpdate }] = useChangePasswordMutation({
        onCompleted() {
            form.reset()
            refetch()
            showSuccessMessage()
        },
        onError() {
            showErrorMessage()
        },
    })

    const { isValid } = form.formState

    const onSubmit = useCallback(
        (data: ChangePasswordSchemaType) => {
            update({ variables: { data } })
        },
        [update],
    )

    return isLoadingProfile ? (
        <ChangePasswordFormSkeleton />
    ) : (
        <FormWrapper heading={t('heading')}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='grid gap-y-3'
                >
                    <PasswordField
                        form={form}
                        name='oldPassword'
                        label={t('oldPasswordLabel')}
                        description={t('oldPasswordDescription')}
                        disabled={isLoadingUpdate}
                        className='px-5'
                    />

                    <Separator />

                    <PasswordField
                        form={form}
                        name='newPassword'
                        label={t('newPasswordLabel')}
                        description={t('newPasswordDescription')}
                        disabled={isLoadingUpdate}
                        className='px-5'
                    />

                    <Separator />

                    <div className='flex justify-end p-5'>
                        <Button
                            disabled={!isValid || isLoadingUpdate}
                            variant='secondary'
                        >
                            {t('submitButton')}
                        </Button>
                    </div>
                </form>
            </Form>
        </FormWrapper>
    )
}

export function ChangePasswordFormSkeleton() {
    return <Skeleton className='h-96 w-full' />
}
