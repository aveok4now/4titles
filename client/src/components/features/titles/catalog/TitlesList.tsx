'use client'

import { Title } from '@/graphql/generated/output'
import { cn } from '@/utils/tw-merge'
import { TitlePosterCard } from './TitlePosterCard'

interface TitlesListProps {
    titles: Title[]
    className?: string
    isFavoriteOverride?: boolean
}

export function TitlesList({
    titles,
    className,
    isFavoriteOverride,
}: TitlesListProps) {
    if (!titles || titles.length === 0) {
        return null
    }

    return (
        <div
            className={cn(
                'grid grid-cols-2 gap-3 overflow-hidden pb-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
                className,
            )}
        >
            {titles.map(title => (
                <TitlePosterCard
                    key={title.id}
                    title={title}
                    initialIsFavorite={isFavoriteOverride}
                />
            ))}
        </div>
    )
}
