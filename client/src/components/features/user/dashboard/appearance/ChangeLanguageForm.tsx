'use client'

import { Form, FormField } from '@/components/ui/common/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/common/select'
import { CardContainer } from '@/components/ui/elements/CardContainer'
import { LANGUAGE_OPTIONS } from '@/libs/i18n/config'
import { setCurrentLanguage } from '@/libs/i18n/language'
import {
    changeLanguageSchema,
    ChangeLanguageSchemaType,
} from '@/schemas/user/change-language.schema'
import { createFormNotificationHandlers } from '@/utils/form-notifications'
import { cn } from '@/utils/tw-merge'
import { zodResolver } from '@hookform/resolvers/zod'
import { Languages } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useCallback, useTransition } from 'react'
import { useForm } from 'react-hook-form'

export interface ChangeLanguageFormProps {
    className?: string
}

export function ChangeLanguageForm({ className }: ChangeLanguageFormProps) {
    const t = useTranslations('dashboard.settings.appearance.language')
    const locale = useLocale()

    const [isPending, startTransition] = useTransition()

    const form = useForm<ChangeLanguageSchemaType>({
        resolver: zodResolver(changeLanguageSchema),
        values: {
            language: locale as ChangeLanguageSchemaType['language'],
        },
    })

    const { handleSuccess: showSuccessMessage } =
        createFormNotificationHandlers({
            successMessage: t('successMessage'),
        })

    const onSubmit = useCallback(
        (data: ChangeLanguageSchemaType) => {
            startTransition(async () => {
                try {
                    await setCurrentLanguage(data.language)
                } catch {
                    showSuccessMessage()
                }
            })
        },
        [showSuccessMessage],
    )

    const getLanguageName = useCallback(
        (code: string) =>
            LANGUAGE_OPTIONS[code as keyof typeof LANGUAGE_OPTIONS] ?? code,
        [],
    )

    const handleValueChange = useCallback(
        (value: string) => {
            form.setValue(
                'language',
                value as ChangeLanguageSchemaType['language'],
            )
            form.handleSubmit(onSubmit)()
        },
        [form, onSubmit],
    )

    return (
        <CardContainer
            heading={t('heading')}
            description={t('description')}
            rightContent={
                <Form {...form}>
                    <FormField
                        control={form.control}
                        name='language'
                        render={({ field }) => (
                            <Select
                                onValueChange={handleValueChange}
                                value={field.value}
                                disabled={isPending}
                            >
                                <SelectTrigger
                                    className={cn('w-40', className)}
                                    aria-label={t('selectPlaceholder')}
                                >
                                    <div className='flex items-center gap-2'>
                                        <Languages className='size-4' />
                                        <span className='truncate'>
                                            {getLanguageName(field.value)}
                                        </span>
                                    </div>
                                </SelectTrigger>
                                <SelectContent side='bottom'>
                                    {Object.entries(LANGUAGE_OPTIONS).map(
                                        ([code, name]) => (
                                            <SelectItem
                                                key={code}
                                                value={code}
                                                disabled={isPending}
                                            >
                                                {name}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </Form>
            }
        />
    )
}
