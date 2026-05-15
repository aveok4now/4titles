import { FavoritesContent } from '@/components/features/favorites/FavoritesContent'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('favorites')

    return {
        title: t('heading'),
        description: t('description'),
    }
}

export default async function FavoritesPage() {
    return <FavoritesContent />
}
