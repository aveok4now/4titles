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
import { FormWrapper } from '@/components/ui/elements/FormWrapper'
import {
    useCreateSocialLinkMutation,
    useFindSocialLinksQuery,
} from '@/graphql/generated/output'
import {
    socialLinksSchema,
    SocialLinksSchemaType,
} from '@/schemas/user/social-links.schema'
import { createFormNotificationHandlers } from '@/utils/form-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { SocialLinksList } from './SocialLinksList'

export function SocialLinksForm() {
    const t = useTranslations(
        'dashboard.settings.profile.socialLinks.createForm',
    )

    const { loading: isLoadingSocialLinks, refetch } = useFindSocialLinksQuery()

    const form = useForm<SocialLinksSchemaType>({
        resolver: zodResolver(socialLinksSchema),
        defaultValues: {
            title: '',
            url: '',
        },
    })

    const { handleSuccess: showSuccessToast, handleError: showErrorToast } =
        createFormNotificationHandlers({
            successMessage: t('successMessage'),
            errorMessage: t('errorMessage'),
        })

    const [create, { loading: isLoadingSocialLinksCreate }] =
        useCreateSocialLinkMutation({
            onCompleted() {
                form.reset()
                refetch()
                showSuccessToast()
            },
            onError() {
                showErrorToast()
            },
        })

    const { isValid } = form.formState

    const onSubmit = useCallback(
        (data: SocialLinksSchemaType) => {
            create({ variables: { data } })
        },
        [create],
    )

    return isLoadingSocialLinks ? (
        <SocialLinksFormSkeleton />
    ) : (
        <FormWrapper heading={t('heading')}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='grid gap-y-3'
                >
                    <FormField
                        control={form.control}
                        name='title'
                        render={({ field }) => (
                            <FormItem className='px-5'>
                                <FormLabel>{t('titleLabel')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t('titlePlaceholder')}
                                        disabled={isLoadingSocialLinksCreate}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    {t('titleDescription')}
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <FormField
                        control={form.control}
                        name='url'
                        render={({ field }) => (
                            <FormItem className='px-5 pb-3'>
                                <FormLabel>{t('urlLabel')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t('urlPlaceholder')}
                                        disabled={isLoadingSocialLinksCreate}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    {t('urlDescription')}
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <div className='flex items-center justify-end p-4'>
                        <Button
                            variant='secondary'
                            disabled={!isValid || isLoadingSocialLinksCreate}
                        >
                            {t('submitButton')}
                        </Button>
                    </div>
                </form>
            </Form>

            <SocialLinksList />
        </FormWrapper>
    )
}

export function SocialLinksFormSkeleton() {
    return <Skeleton className='h-72 w-full' />
}
