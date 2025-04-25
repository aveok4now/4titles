'use client'

import { Form, FormField } from '@/components/ui/common/form'
import { CardContainer } from '@/components/ui/elements/CardContainer'
import { ThemeToggle } from '@/components/ui/elements/ThemeToggle'
import { useDeviceSize } from '@/hooks/useDeviceSize'
import {
    changeThemeSchema,
    ChangeThemeSchemaType,
    ThemeType,
} from '@/schemas/user/change-theme.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export function ChangeThemeForm() {
    const t = useTranslations('dashboard.settings.appearance.theme')

    const { theme } = useTheme()
    const { isMobile } = useDeviceSize()

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const form = useForm<ChangeThemeSchemaType>({
        resolver: zodResolver(changeThemeSchema),
        values: {
            theme: (mounted ? theme || 'system' : 'system') as ThemeType,
        },
    })

    return (
        <Form {...form}>
            <FormField
                control={form.control}
                name='theme'
                render={() => (
                    <CardContainer
                        heading={t('heading')}
                        description={t('description')}
                        rightContent={
                            <ThemeToggle
                                lightLabel={t('light')}
                                darkLabel={t('dark')}
                                systemLabel={t('system')}
                                toggleLabel={t('toggle')}
                                showLabel
                                contentAlign={isMobile ? 'center' : 'end'}
                            />
                        }
                    />
                )}
            />
        </Form>
    )
}
