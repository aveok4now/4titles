import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { FilmingLocationProposalsTable } from '@/components/features/user/dashboard/filming-location-proposals/FilmingLocationProposalsTable'
import { NO_INDEX_PAGE } from '@/libs/constants/seo.constants'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('dashboard.filmingLocationProposals.header')

    return {
        title: t('heading'),
        description: t('description'),
        ...NO_INDEX_PAGE,
    }
}

export default function FilmingLocationProposalsPage() {
    return <FilmingLocationProposalsTable />
}
