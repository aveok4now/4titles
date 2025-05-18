'use client'

import { EmptySearchState } from '@/components/ui/elements/EmptySearchState'
import { Collection } from '@/graphql/generated/output'
import { cn } from '@/utils/tw-merge'
import { useLocale } from 'next-intl'
import { CollectionCard } from './CollectionCard'

interface CollectionsListProps {
    collections: Collection[]
    className?: string
    emptyMessage?: string
    isLoading?: boolean
    isSearchApplied?: boolean
}

export function CollectionsList({
    collections,
    className,
    emptyMessage,
    isLoading = false,
    isSearchApplied = false,
}: CollectionsListProps) {
    const locale = useLocale()

    if (collections.length > 0) {
        return (
            <div
                className={cn(
                    'grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3',
                    className,
                )}
            >
                {collections.map((collection, index) => (
                    <CollectionCard
                        key={`${collection.id}-${index}`}
                        collection={collection}
                        locale={locale}
                    />
                ))}
            </div>
        )
    }

    if (!isLoading && emptyMessage) {
        return <EmptySearchState emptyMessage={emptyMessage} />
    }

    return null
}
