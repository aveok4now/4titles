import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { FeedbacksTable } from '@/components/features/user/feedbacks/FeedbacksTable'
import { NO_INDEX_PAGE } from '@/libs/constants/seo.constants'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('dashboard.feedbacks.header')

    return {
        title: t('heading'),
        description: t('description'),
        ...NO_INDEX_PAGE,
    }
}

export default function FeedbacksPage() {
    return <FeedbacksTable />
}
