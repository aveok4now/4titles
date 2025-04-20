'use client'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/common/tabs'
import { Heading } from '@/components/ui/elements/Heading'
import { useBackground } from '@/contexts/background-context'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { ChangeAvatarForm } from './profile/ChangeAvatarForm'

export function UserSettings() {
    const t = useTranslations('dashboard.settings')

    const { setBackgroundType } = useBackground()

    useEffect(() => {
        setBackgroundType('aurora')
        return () => setBackgroundType('default')
    }, [setBackgroundType])

    return (
        <div className='lg:px-10'>
            <Heading
                title={t('header.heading')}
                description={t('header.description')}
                size='lg'
            />
            <Tabs defaultValue='profile' className='mt-3 w-full'>
                <div className='w-full md:max-w-3xl'>
                    <TabsList className='w-full'>
                        <div className='flex w-full items-center justify-between overflow-x-auto'>
                            <TabsTrigger
                                value='profile'
                                className='flex-1 text-center'
                            >
                                {t('header.profile')}
                            </TabsTrigger>
                            <TabsTrigger
                                value='account'
                                className='flex-1 text-center'
                            >
                                {t('header.account')}
                            </TabsTrigger>
                            <TabsTrigger
                                value='appearance'
                                className='flex-1 text-center'
                            >
                                {t('header.appearance')}
                            </TabsTrigger>
                            <TabsTrigger
                                value='notifications'
                                className='flex-1 text-center'
                            >
                                {t('header.notifications')}
                            </TabsTrigger>
                            <TabsTrigger
                                value='sessions'
                                className='flex-1 text-center'
                            >
                                {t('header.sessions')}
                            </TabsTrigger>
                        </div>
                    </TabsList>
                </div>
                <TabsContent value='profile'>
                    <div className='mt-5 space-y-6'>
                        <Heading
                            title={t('profile.header.heading')}
                            description={t('profile.header.description')}
                        />
                        <ChangeAvatarForm />
                    </div>
                </TabsContent>
                <TabsContent value='account'>Аккаунт</TabsContent>
                <TabsContent value='appearance'>Внешний вид</TabsContent>
                <TabsContent value='notifications'>Уведомления</TabsContent>
                <TabsContent value='sessions'>Сессии</TabsContent>
            </Tabs>
        </div>
    )
}
