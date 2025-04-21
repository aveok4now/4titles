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
import { Separator } from '@/components/ui/common/separator'
import { Skeleton } from '@/components/ui/common/skeleton'
import { Textarea } from '@/components/ui/common/textarea'
import { FormWrapper } from '@/components/ui/elements/FormWrapper'
import { useChangeProfileInfoMutation } from '@/graphql/generated/output'
import { useCurrent } from '@/hooks/useCurrent'
import {
    changeInfoSchema,
    ChangeInfoSchemaType,
} from '@/schemas/user/change-info.schema'
import { createFormNotificationHandlers } from '@/utils/form-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

export function ChangeInfoForm() {
    const t = useTranslations('dashboard.settings.profile.info')

    const { profile, isLoadingProfile, refetch } = useCurrent()

    const form = useForm<ChangeInfoSchemaType>({
        resolver: zodResolver(changeInfoSchema),
        values: {
            username: profile?.username ?? '',
            displayName: profile?.displayName ?? '',
            bio: profile?.bio ?? '',
        },
    })

    const { handleSuccess, handleError } = createFormNotificationHandlers({
        successMessage: t('successMessage'),
        errorMessage: t('errorMessage'),
        errorDescription: t('errorMessageDescription'),
    })

    const [update, { loading: isLoadingProfileInfoUpdate }] =
        useChangeProfileInfoMutation({
            onCompleted() {
                refetch()
                handleSuccess()
            },
            onError() {
                handleError()
            },
        })

    const { isValid, isDirty } = form.formState

    const onSubmit = useCallback(
        (data: ChangeInfoSchemaType) => {
            update({ variables: { data } })
        },
        [update],
    )

    return isLoadingProfile ? (
        <ChangeInfoFormSkeleton />
    ) : (
        <FormWrapper heading={t('heading')}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='grid gap-y-3'
                >
                    <FormField
                        control={form.control}
                        name='username'
                        render={({ field }) => (
                            <FormItem className='px-5'>
                                <FormLabel>{t('usernameLabel')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t('usernamePlaceholder')}
                                        disabled={isLoadingProfileInfoUpdate}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    {t('usernameDescription')}
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <FormField
                        control={form.control}
                        name='displayName'
                        render={({ field }) => (
                            <FormItem className='px-5'>
                                <FormLabel>{t('displayNameLabel')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t(
                                            'displayNamePlaceholder',
                                        )}
                                        disabled={isLoadingProfileInfoUpdate}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    {t('displayNameDescription')}
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <FormField
                        control={form.control}
                        name='bio'
                        render={({ field }) => (
                            <FormItem className='px-5 pb-3'>
                                <FormLabel>{t('bioLabel')}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={t('bioPlaceholder')}
                                        disabled={isLoadingProfileInfoUpdate}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    {t('bioDescription')}
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <div className='flex items-center justify-end p-4'>
                        <Button
                            variant='secondary'
                            disabled={
                                !isValid ||
                                !isDirty ||
                                isLoadingProfileInfoUpdate
                            }
                        >
                            {t('submitButton')}
                        </Button>
                    </div>
                </form>
            </Form>
        </FormWrapper>
    )
}

export function ChangeInfoFormSkeleton() {
    return <Skeleton className='h-96 w-full' />
}
