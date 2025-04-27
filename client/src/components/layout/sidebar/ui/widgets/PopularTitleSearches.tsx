'use client'

import ShinyText from '@/components/ui/custom/text/shiny-text'
import { useFindPopularTitlesQuery } from '@/graphql/generated/output'
import { useSidebar } from '@/hooks/useSidebar'
import { useTranslations } from 'next-intl'
import { PopularTitleItem, PopularTitleItemSkeleton } from './PopularTItleItem'

export function PopularTitleSearches() {
    const t = useTranslations('layout.sidebar.popularTitleSearches')

    const { isCollapsed } = useSidebar()

    const { data, loading: isLoadingPopularTitles } = useFindPopularTitlesQuery(
        {
            variables: { limit: 7 },
        },
    )
    const topSearches = data?.findPopularTitles || []

    return (
        <div className='pb-4'>
            {!isCollapsed && (
                <ShinyText
                    className='mb-2 p-3 text-lg font-semibold text-foreground/90'
                    text={t('title')}
                />
            )}
            {isLoadingPopularTitles
                ? Array.from({ length: 7 }).map((_, index) => (
                      <PopularTitleItemSkeleton key={index} />
                  ))
                : topSearches.map((title, index) => (
                      <PopularTitleItem key={index} title={title} />
                  ))}
        </div>
    )
}
