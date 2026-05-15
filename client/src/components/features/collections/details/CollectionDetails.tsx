'use client'

import { CommentsSection } from '@/components/features/comments/CommentsSection'
import { Badge } from '@/components/ui/common/badge'
import { Button } from '@/components/ui/common/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/common/dropdown-menu'
import { AuroraText } from '@/components/ui/custom/text/aurora-text'
import { ConfirmDialog } from '@/components/ui/elements/ConfirmDialog'
import { Heading } from '@/components/ui/elements/Heading'
import { LogoImage } from '@/components/ui/elements/LogoImage'
import { ProfileAvatar } from '@/components/ui/elements/ProfileAvatar'
import {
    Collection,
    CollectionType,
    CommentableType,
    FavorableType,
    FindCollectionBySlugDocument,
    FindCollectionBySlugQuery,
    LocationCollectionItem,
    TitleCollectionItem,
    useDeleteCollectionMutation,
    useFindCollectionBySlugQuery,
} from '@/graphql/generated/output'
import { useCurrent } from '@/hooks/useCurrent'
import { formatTimeAgo } from '@/utils/date/format-time-ago'
import { getMediaSource } from '@/utils/get-media-source'
import { useApolloClient } from '@apollo/client'
import { Flag, Info, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { FavoriteButton } from '../../favorites'
import { CollectionPageWrapper } from '../CollectionPageWrapper'
import { CollectionForm } from '../form'
import { LocationCollectionView } from './LocationCollectionView'
import { ReportCollectionDialog } from './ReportCollectionDialog'
import { TitleCollectionView } from './TitleCollectionView'

export interface CollectionDetailsProps {
    initialCollection?: FindCollectionBySlugQuery['findCollectionBySlug']
}

export function CollectionDetails({
    initialCollection,
}: CollectionDetailsProps) {
    const t = useTranslations('collections.details')
    const locale = useLocale()
    const params = useParams() as { slug: string }
    const apolloClient = useApolloClient()
    const router = useRouter()

    const { profile } = useCurrent()

    const [isEditing, setIsEditing] = useState(false)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isReportOpen, setIsReportOpen] = useState(false)
    const [collection, setCollection] = useState<
        FindCollectionBySlugQuery['findCollectionBySlug'] | null
    >(initialCollection || null)

    const [deleteCollection] = useDeleteCollectionMutation({
        onCompleted: () => {
            toast.success(t('deleteSuccess'))
            router.push('/collections')
        },
        onError: () => {
            toast.error(t('deleteError'), {
                description: t('deleteErrorDescription'),
            })
        },
    })

    const { data, loading, refetch } = useFindCollectionBySlugQuery({
        variables: {
            slug: params.slug,
        },
        skip: !!initialCollection,
        fetchPolicy: 'cache-and-network',
    })

    useEffect(() => {
        if (data?.findCollectionBySlug) {
            setCollection(data.findCollectionBySlug as Collection)
        }
    }, [data])

    const toggleEditMode = () => {
        setIsEditing(!isEditing)
    }

    const handleEditComplete = async () => {
        setIsEditing(false)

        await apolloClient.resetStore()

        const { data: refreshedData } = await apolloClient.query({
            query: FindCollectionBySlugDocument,
            variables: { slug: params.slug },
            fetchPolicy: 'network-only',
        })

        if (refreshedData?.findCollectionBySlug) {
            setCollection(refreshedData.findCollectionBySlug as Collection)
        }
    }

    const handleDeleteCollection = () => {
        if (collection) {
            deleteCollection({
                variables: {
                    deleteCollectionId: collection.id,
                },
            })
        }
    }

    if (!collection) return null

    const {
        id,
        title,
        description,
        coverImage,
        type,
        user,
        createdAt,
        updatedAt,
        titleItems,
        locationItems,
    } = collection

    const isOwner = profile?.id === user?.id

    const imageUrl = coverImage ? getMediaSource(coverImage) : null

    return (
        <CollectionPageWrapper className='space-y-6'>
            {isEditing ? (
                <CollectionForm
                    initialCollection={collection as Collection}
                    onComplete={handleEditComplete}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <>
                    <div className='relative mb-8 overflow-hidden rounded-xl'>
                        <div
                            className='h-64 w-full bg-cover bg-center md:h-80'
                            style={{
                                backgroundImage: imageUrl
                                    ? `url(${imageUrl})`
                                    : 'none',
                            }}
                        >
                            {!coverImage && (
                                <div className='flex h-full w-full items-center justify-center bg-muted/20'>
                                    <LogoImage
                                        width={80}
                                        height={80}
                                        className='opacity-20'
                                    />
                                </div>
                            )}
                            <div className='absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent' />
                            <div className='absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-transparent' />
                        </div>

                        <div className='absolute right-4 top-4 flex items-center gap-2'>
                            <FavoriteButton
                                favorableId={id}
                                favorableType={FavorableType.Collection}
                                variant='default'
                            />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size='icon' variant='secondary'>
                                        <MoreHorizontal className='size-4' />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    {isOwner ? (
                                        <>
                                            <DropdownMenuItem
                                                onClick={toggleEditMode}
                                            >
                                                <Pencil className='mr-2 size-4' />
                                                {t('edit')}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setIsConfirmOpen(true)
                                                }
                                                className='text-destructive focus:text-destructive'
                                            >
                                                <Trash2 className='mr-2 size-4' />
                                                {t('delete')}
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setIsReportOpen(true)
                                            }
                                        >
                                            <Flag className='mr-2 size-4' />
                                            {t('report')}
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className='absolute left-4 top-4'>
                            <div className='flex items-center gap-4'>
                                <Link href={`/profile/${user?.username}`}>
                                    <ProfileAvatar profile={user} size='sm' />
                                </Link>
                                <div className='flex flex-col'>
                                    <AuroraText className='text-xs font-semibold'>
                                        {user.username}
                                    </AuroraText>
                                    <AuroraText className='text-xs'>
                                        {formatTimeAgo(
                                            updatedAt || createdAt,
                                            locale,
                                        )}
                                    </AuroraText>
                                </div>
                            </div>
                        </div>

                        <div className='absolute bottom-0 left-0 right-0 p-4'>
                            <div className='flex flex-col'>
                                <div className='flex items-end justify-between'>
                                    <Heading
                                        title={title}
                                        description={
                                            description || t('noDescription')
                                        }
                                        size='sm'
                                    />

                                    <Badge
                                        variant={
                                            type === CollectionType.Title
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {type === CollectionType.Title
                                            ? t('badge.title')
                                            : t('badge.location')}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <>
                        {type === CollectionType.Title &&
                        titleItems &&
                        titleItems.length > 0 ? (
                            <TitleCollectionView
                                titles={titleItems as TitleCollectionItem[]}
                                isEditable={isOwner && isEditing}
                                collectionId={id}
                            />
                        ) : type === CollectionType.Location &&
                          locationItems &&
                          locationItems.length > 0 ? (
                            <LocationCollectionView
                                locations={
                                    locationItems as LocationCollectionItem[]
                                }
                                collectionId={id}
                            />
                        ) : (
                            <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center'>
                                <Info className='mb-4 size-12 text-muted-foreground' />
                                <h3 className='mb-2 text-xl font-semibold'>
                                    {t('empty.heading')}
                                </h3>
                                {isOwner && (
                                    <Button onClick={toggleEditMode}>
                                        <Pencil className='mr-2 size-4' />
                                        {t('empty.addItems')}
                                    </Button>
                                )}
                            </div>
                        )}
                    </>

                    <>
                        <Heading
                            title={t('comments.heading')}
                            description={t('comments.description')}
                        />
                        <CommentsSection
                            commentableId={id}
                            commentableType={CommentableType.Collection}
                            locale={locale}
                        />
                    </>
                </>
            )}

            <ConfirmDialog
                heading={t('confirmDelete.heading')}
                message={t('confirmDelete.message', { title })}
                onConfirm={handleDeleteCollection}
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
            />

            <ReportCollectionDialog
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                collection={collection as Collection}
            />
        </CollectionPageWrapper>
    )
}
