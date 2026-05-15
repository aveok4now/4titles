'use client'

import { EmptySearchState } from '@/components/ui/elements/EmptySearchState'
import { Title } from '@/graphql/generated/output'
import { cn } from '@/utils/tw-merge'
import { TitlePosterCard } from './TitlePosterCard'

interface TitlesListProps {
    titles: Title[]
    className?: string
    isFavoriteOverride?: boolean
    emptyMessage?: string
    onFavoriteChange?: (titleId: string, isFavorite: boolean) => void
}

export function TitlesList({
    titles,
    className,
    isFavoriteOverride,
    emptyMessage,
    onFavoriteChange,
}: TitlesListProps) {
    return titles.length > 0 ? (
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
                    onFavoriteChange={
                        onFavoriteChange
                            ? isFavorite =>
                                  onFavoriteChange(title.id, isFavorite)
                            : undefined
                    }
                />
            ))}
        </div>
    ) : emptyMessage ? (
        <EmptySearchState emptyMessage={emptyMessage} />
    ) : null
}
