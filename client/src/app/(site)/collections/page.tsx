import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { CollectionsContent } from '@/components/features/collections/CollectionsContent'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('collections')

    return {
        title: t('heading'),
        description: t('description'),
    }
}

export default async function CollectionsPage() {
    return <CollectionsContent />
}
