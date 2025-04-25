import { Button } from '@/components/ui/common/button'
import { Skeleton } from '@/components/ui/common/skeleton'
import { Hint } from '@/components/ui/elements/Hint'
import { TitleAvatar } from '@/components/ui/elements/TitleAvatar'
import { GetPopularTitlesQuery, Title } from '@/graphql/generated/output'
import { useSidebar } from '@/hooks/useSidebar'
import { getLocalizedTitleName } from '@/utils/get-localized-title-name'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface PopularTitleItemProps {
    title: GetPopularTitlesQuery['popularTitles'][0]
}

export function PopularTitleItem({ title }: PopularTitleItemProps) {
    const { isCollapsed } = useSidebar()

    const pathname = usePathname()
    const locale = useLocale()

    const titleUrl = `/titles/${title.slug}`
    const isActive = pathname === titleUrl
    const displayName = getLocalizedTitleName(title as Title, locale)

    return isCollapsed ? (
        <div className='mt-3 flex w-full items-center justify-center'>
            <Hint label={displayName} side='right'>
                <Link
                    href={titleUrl}
                    className='flex items-center justify-center'
                >
                    <TitleAvatar
                        posterPath={title.posterPath || null}
                        name={displayName}
                    />
                </Link>
            </Hint>
        </div>
    ) : (
        <Button
            className='relative mt-2 h-11 w-full justify-start'
            variant={isActive ? 'default' : 'ghost'}
            asChild
        >
            <Link href={titleUrl} className='flex w-full items-center'>
                <Hint label={displayName} side='bottom'>
                    <TitleAvatar
                        posterPath={title.posterPath || null}
                        name={displayName}
                        size='default'
                    />
                </Hint>
                <h2 className='truncate pl-3'>{displayName}</h2>
            </Link>
        </Button>
    )
}

export function PopularTitleItemSkeleton() {
    const { isCollapsed } = useSidebar()

    return isCollapsed ? (
        <div className='mt-3 flex w-full items-center justify-center'>
            <Skeleton className='h-10 w-10 rounded-full' />
        </div>
    ) : (
        <div className='mt-2 flex h-11 w-full items-center px-3'>
            <Skeleton className='h-9 w-9 rounded-full' />
            <Skeleton className='ml-3 h-5 w-3/4' />
        </div>
    )
}
