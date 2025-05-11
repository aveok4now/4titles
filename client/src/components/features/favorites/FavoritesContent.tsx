'use client'

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/common/tabs'
import { Heading } from '@/components/ui/elements/Heading'
import { useTranslations } from 'next-intl'
import { FavoriteLocationsSection } from './FavoriteLocationsSection'
import { FavoriteTitlesSection } from './FavoriteTitlesSection'

export function FavoritesContent() {
    const t = useTranslations('favorites')

    return (
        <>
            <Heading
                title={t('heading')}
                description={t('description')}
                size='lg'
            />

            <Tabs defaultValue='titles' className='my-4 w-full'>
                <div className='flex w-full items-center justify-between md:max-w-3xl'>
                    <TabsList className='w-full'>
                        <TabsTrigger
                            value='titles'
                            className='flex-1 text-center'
                        >
                            {t('tabs.titles')}
                        </TabsTrigger>
                        <TabsTrigger
                            value='locations'
                            className='flex-1 text-center'
                        >
                            {t('tabs.locations')}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value='titles' className='mt-5 space-y-6'>
                    <FavoriteTitlesSection />
                </TabsContent>

                <TabsContent value='locations' className='mt-5 space-y-6'>
                    <FavoriteLocationsSection />
                </TabsContent>
            </Tabs>
        </>
    )
}
