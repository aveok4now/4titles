import { FaqList } from '@/components/features/faq/FaqList'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('faq')

    return {
        title: t('heading'),
    }
}

export default function FaqPage() {
    return <FaqList />
}
