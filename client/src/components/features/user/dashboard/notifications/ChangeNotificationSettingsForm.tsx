'use client'

import { Form, FormField } from '@/components/ui/common/form'
import {
    ToggleCard,
    ToggleCardSkeleton,
} from '@/components/ui/elements/ToggleCard'
import { useChangeNotificationSettingsMutation } from '@/graphql/generated/output'
import { useCurrent } from '@/hooks/useCurrent'
import { TELEGRAM_BOT_URL } from '@/libs/constants/url.constants'
import {
    changeNotificationSettingsSchema,
    ChangeNotificationSettingsSchemaType,
} from '@/schemas/user/change-notification-settings.schema'
import { createFormNotificationHandlers } from '@/utils/form-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

export function ChangeNotificationSettingsForm() {
    const t = useTranslations('dashboard.settings.notifications')

    const { profile, isLoadingProfile, refetch } = useCurrent()

    const form = useForm<ChangeNotificationSettingsSchemaType>({
        resolver: zodResolver(changeNotificationSettingsSchema),
        values: {
            isSiteNotificationsEnabled:
                profile?.notificationSettings?.isSiteNotificationsEnabled ??
                false,
            isTelegramNotificationsEnabled:
                profile?.notificationSettings?.isTelegramNotificationsEnabled ??
                false,
        },
    })

    const { handleSuccess: showSuccessMessage, handleError: showErrorMessage } =
        createFormNotificationHandlers({
            successMessage: t('successMessage'),
            errorMessage: t('errorMessage'),
        })

    const [update, { loading: isUpdating }] =
        useChangeNotificationSettingsMutation({
            onCompleted(data) {
                refetch()
                showSuccessMessage()

                if (data.changeSettings.telegramAuthToken) {
                    window.open(
                        `${TELEGRAM_BOT_URL}?start=${data.changeSettings.telegramAuthToken}`,
                        '_blank',
                    )
                }
            },
            onError() {
                showErrorMessage()
            },
        })

    const handleToggle = useCallback(
        (field: keyof ChangeNotificationSettingsSchemaType, value: boolean) => {
            form.setValue(field, value)
            update({
                variables: {
                    data: { ...form.getValues(), [field]: value },
                },
            })
        },
        [form, update],
    )

    return isLoadingProfile ? (
        Array.from({ length: 2 }).map((_, index) => (
            <ToggleCardSkeleton key={index} />
        ))
    ) : (
        <Form {...form}>
            <FormField
                control={form.control}
                name='isSiteNotificationsEnabled'
                render={({ field }) => (
                    <ToggleCard
                        heading={t('siteNotifications.heading')}
                        description={t('siteNotifications.description')}
                        isDisabled={isUpdating}
                        value={field.value}
                        onChange={value =>
                            handleToggle('isSiteNotificationsEnabled', value)
                        }
                    />
                )}
            />
            <FormField
                control={form.control}
                name='isTelegramNotificationsEnabled'
                render={({ field }) => (
                    <ToggleCard
                        heading={t('telegramNotifications.heading')}
                        description={t('telegramNotifications.description')}
                        isDisabled={isUpdating}
                        value={field.value}
                        onChange={value =>
                            handleToggle(
                                'isTelegramNotificationsEnabled',
                                value,
                            )
                        }
                    />
                )}
            />
        </Form>
    )
}
