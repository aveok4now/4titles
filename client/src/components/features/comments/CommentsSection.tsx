'use client'

import {
    CommentableType,
    CommentSortOption,
    useCreateCommentMutation,
    useDeleteCommentMutation,
    useFindCommentsQuery,
    useToggleLikeCommentMutation,
    useUpdateCommentMutation,
    type Comment,
    type User,
} from '@/graphql/generated/output'

import { ReportCommentDialog } from '@/components/features/comments/ReportCommentDialog'
import { Button } from '@/components/ui/common/button'
import { Input } from '@/components/ui/common/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/common/select'
import { Separator } from '@/components/ui/common/separator'
import { EmptySearchState } from '@/components/ui/elements/EmptySearchState'
import { Heading } from '@/components/ui/elements/Heading'
import { Link } from '@/components/ui/elements/Link'
import { Spinner } from '@/components/ui/elements/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { useCurrent } from '@/hooks/useCurrent'
import { AUTH_ROUTES } from '@/libs/constants/auth.constants'
import { DEFAULT_LANGUAGE } from '@/libs/i18n/config'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { toast } from 'sonner'
import { CommentForm } from './CommentForm'
import { CommentsList } from './CommentsList'

interface CommentsSectionProps {
    commentableId: string
    commentableType: CommentableType
    locale?: string
    containerComponent?: React.ComponentType<{
        delay?: number
        title: string
        description?: string
        children: React.ReactNode
    }>
}

const COMMENTS_PER_PAGE = 10

export function CommentsSection({
    commentableId,
    commentableType,
    locale = DEFAULT_LANGUAGE,
}: CommentsSectionProps) {
    const t = useTranslations('components.comments')
    const { isAuthenticated } = useAuth()
    const { profile } = useCurrent()
    const userId = profile?.id
    const searchParams = useSearchParams()
    const commentId = searchParams.get('comment')

    const [reportCommentId, setReportCommentId] = useState<string | null>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const [loadedCount, setLoadedCount] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [newCommentIds, setNewCommentIds] = useState<Set<string>>(new Set())
    const [sortOption, setSortOption] = useState<CommentSortOption>(
        CommentSortOption.DateDesc,
    )
    const [searchQuery, setSearchQuery] = useState('')
    const [currentSearch, setCurrentSearch] = useState('')

    const commentRefsMap = useRef(new Map<string, HTMLDivElement>())
    const commentsSectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (commentId) {
            const timer = setTimeout(() => {
                const commentEl = commentRefsMap.current.get(commentId)
                if (commentEl) {
                    commentEl.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                    })
                    commentEl.classList.add('animate-highlight')
                    setTimeout(() => {
                        commentEl.classList.remove('animate-highlight')
                    }, 3000)
                }
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [commentId, comments.length])

    useEffect(() => {
        if (newCommentIds.size > 0) {
            const timer = setTimeout(() => {
                setNewCommentIds(new Set())
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [newCommentIds])

    const {
        loading: isLoadingComments,
        fetchMore,
        refetch,
    } = useFindCommentsQuery({
        variables: {
            filter: {
                commentableId,
                commentableType,
                take: COMMENTS_PER_PAGE,
                skip: 0,
                sortBy: sortOption,
                search: currentSearch || undefined,
            },
        },
        fetchPolicy: 'network-only',
        onCompleted(data) {
            if (data?.findComments) {
                setComments(data.findComments as Comment[])
                setLoadedCount(data.findComments.length)
                setHasMore(data.findComments.length === COMMENTS_PER_PAGE)
                setIsLoading(false)
            }
        },
        onError(error) {
            setIsLoading(false)
            setHasMore(false)
            toast.error(t('notifications.loadError'))
        },
    })

    useEffect(() => {
        setIsLoading(true)
        setComments([])
        setLoadedCount(0)
        setHasMore(true)

        refetch({
            filter: {
                commentableId,
                commentableType,
                take: COMMENTS_PER_PAGE,
                skip: 0,
                sortBy: sortOption,
                search: currentSearch || undefined,
            },
        })
            .then(({ data }) => {
                if (data?.findComments) {
                    const receivedComments = data.findComments as Comment[]
                    setComments(receivedComments)
                    setLoadedCount(receivedComments.length)
                    setHasMore(receivedComments.length === COMMENTS_PER_PAGE)
                } else {
                    setHasMore(false)
                }
            })
            .catch(error => {
                toast.error(t('notifications.refreshError'))
                setHasMore(false)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [commentableId, commentableType, refetch, sortOption, currentSearch, t])

    const removeCommentFromTree = useCallback(
        (commentsArray: Comment[], commentIdToRemove: string): Comment[] => {
            return commentsArray
                .filter(comment => comment.id !== commentIdToRemove)
                .map(comment => {
                    if (comment.replies?.length) {
                        return {
                            ...comment,
                            replies: removeCommentFromTree(
                                comment.replies as Comment[],
                                commentIdToRemove,
                            ),
                        }
                    }
                    return comment
                })
        },
        [],
    )

    const updateCommentInTree = useCallback(
        (
            commentsArray: Comment[],
            commentId: string,
            updatedMessage: string,
        ): Comment[] => {
            return commentsArray.map(comment => {
                if (comment.id === commentId) {
                    return { ...comment, message: updatedMessage }
                }

                if (comment.replies?.length) {
                    return {
                        ...comment,
                        replies: updateCommentInTree(
                            comment.replies as Comment[],
                            commentId,
                            updatedMessage,
                        ),
                    }
                }

                return comment
            })
        },
        [],
    )

    const updateCommentsWithLike = useCallback(
        (
            commentsArray: Comment[],
            commentId: string,
            liked: boolean,
            count: number,
        ): Comment[] => {
            return commentsArray.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        likedByMe: liked,
                        likeCount: count,
                    }
                }

                if (comment.replies?.length) {
                    return {
                        ...comment,
                        replies: updateCommentsWithLike(
                            comment.replies as Comment[],
                            commentId,
                            liked,
                            count,
                        ),
                    }
                }

                return comment
            })
        },
        [],
    )

    const [createComment] = useCreateCommentMutation({
        onCompleted: () => {
            toast.success(t('notifications.createSuccess'))
            refetchCommentsAndUpdate()
        },
        onError: () => {
            toast.error(t('notifications.createError'))
        },
    })

    const [updateComment] = useUpdateCommentMutation({
        onCompleted: () => {
            toast.success(t('notifications.updateSuccess'))
            refetchCommentsAndUpdate()
        },
        onError: () => {
            toast.error(t('notifications.updateError'))
        },
    })

    const [deleteComment] = useDeleteCommentMutation({
        onCompleted: () => {
            toast.success(t('notifications.deleteSuccess'))
            refetchCommentsAndUpdate()
        },
        onError: () => {
            toast.error(t('notifications.deleteError'))
        },
    })

    const [toggleLike] = useToggleLikeCommentMutation({
        onError: () => {
            toast.error(t('notifications.likeError'))
            if (lastLikedCommentRef.current) {
                const { commentId, wasLiked, likeCount } =
                    lastLikedCommentRef.current
                setComments(prevComments =>
                    updateCommentsWithLike(
                        prevComments,
                        commentId,
                        wasLiked,
                        likeCount,
                    ),
                )
            }
        },
    })

    const lastLikedCommentRef = useRef<{
        commentId: string
        wasLiked: boolean
        likeCount: number
    } | null>(null)

    const refetchCommentsAndUpdate = useCallback(async () => {
        try {
            setIsLoading(true)
            const { data } = await refetch({
                filter: {
                    commentableId,
                    commentableType,
                    take: COMMENTS_PER_PAGE,
                    skip: 0,
                    sortBy: sortOption,
                    search: currentSearch || undefined,
                },
            })

            if (data?.findComments) {
                setComments(data.findComments as Comment[])
                setLoadedCount(data.findComments.length)
                setHasMore(data.findComments.length === COMMENTS_PER_PAGE)
            }
        } catch (error) {
            toast.error(t('notifications.refreshError'))
        } finally {
            setIsLoading(false)
        }
    }, [commentableId, commentableType, refetch, sortOption, currentSearch, t])

    const handleLoadMoreComments = useCallback(async () => {
        if (isLoading || !hasMore) return

        setIsLoading(true)
        const nextPage = loadedCount

        try {
            const { data } = await fetchMore({
                variables: {
                    filter: {
                        commentableId,
                        commentableType,
                        take: COMMENTS_PER_PAGE,
                        skip: nextPage,
                        sortBy: sortOption,
                        search: currentSearch || undefined,
                    },
                },
            })

            if (data?.findComments?.length) {
                const receivedComments = data.findComments as Comment[]

                const existingIds = new Set(comments.map(c => c.id))
                const newComments = receivedComments.filter(
                    c => !existingIds.has(c.id),
                )

                if (newComments.length > 0) {
                    setComments(prev => [...prev, ...newComments])
                    setLoadedCount(prev => prev + newComments.length)
                    setHasMore(receivedComments.length === COMMENTS_PER_PAGE)
                } else {
                    setHasMore(false)
                }
            } else {
                setHasMore(false)
            }
        } catch (error) {
            toast.error(t('notifications.loadMoreError'))
            setHasMore(false)
        } finally {
            setIsLoading(false)
        }
    }, [
        commentableId,
        commentableType,
        comments,
        currentSearch,
        fetchMore,
        hasMore,
        isLoading,
        loadedCount,
        sortOption,
        t,
    ])

    const handleCreateComment = useCallback(
        (message: string, parentId?: string) => {
            if (!isAuthenticated) {
                toast.error(t('authRequired.message'))
                return
            }

            createComment({
                variables: {
                    input: {
                        message,
                        commentableId,
                        commentableType,
                        parentId: parentId || null,
                    },
                },
            })
        },
        [createComment, isAuthenticated, commentableId, commentableType, t],
    )

    const handleUpdateComment = useCallback(
        (commentId: string, message: string) => {
            if (!isAuthenticated) return

            setComments(prevComments =>
                updateCommentInTree(prevComments, commentId, message),
            )

            updateComment({
                variables: {
                    input: {
                        commentId,
                        message,
                    },
                },
            })
        },
        [isAuthenticated, updateComment, updateCommentInTree],
    )

    const handleDeleteComment = useCallback(
        (commentId: string) => {
            if (!isAuthenticated) return

            setComments(prevComments =>
                removeCommentFromTree(prevComments, commentId),
            )

            deleteComment({
                variables: {
                    input: {
                        commentId,
                    },
                },
            })
        },
        [isAuthenticated, deleteComment, removeCommentFromTree],
    )

    const handleToggleLike = useCallback(
        (commentId: string) => {
            if (!isAuthenticated) {
                toast.error(t('like.authRequired'))
                return
            }

            const findComment = (
                comments: Comment[],
                id: string,
            ): Comment | null => {
                for (const comment of comments) {
                    if (comment.id === id) {
                        return comment
                    }

                    if (comment.replies?.length) {
                        const found = findComment(
                            comment.replies as Comment[],
                            id,
                        )
                        if (found) return found
                    }
                }
                return null
            }

            const comment = findComment(comments, commentId)
            if (!comment) return

            lastLikedCommentRef.current = {
                commentId,
                wasLiked: comment.likedByMe,
                likeCount: comment.likeCount,
            }

            const newLiked = !comment.likedByMe
            const newCount = newLiked
                ? comment.likeCount + 1
                : Math.max(0, comment.likeCount - 1)

            setComments(prevComments =>
                updateCommentsWithLike(
                    prevComments,
                    commentId,
                    newLiked,
                    newCount,
                ),
            )

            toggleLike({
                variables: {
                    input: { commentId },
                },
            })
        },
        [isAuthenticated, toggleLike, t, comments, updateCommentsWithLike],
    )

    const handleReportComment = useCallback(
        (commentId: string, message: string) => {
            toast.success(t('report.success'))
            setReportCommentId(null)
        },
        [t],
    )

    const handleShareComment = useCallback(
        (commentId: string) => {
            const url = new URL(window.location.href)
            url.searchParams.set('comment', commentId)

            window.history.pushState({}, '', url.toString())
            navigator.clipboard.writeText(url.toString())
            toast.success(t('shareSuccess'))
        },
        [t],
    )

    const setCommentRef = useCallback(
        (id: string, el: HTMLDivElement | null) => {
            if (el) {
                commentRefsMap.current.set(id, el)
            }
        },
        [],
    )

    const reportComment = useCallback(() => {
        if (!reportCommentId || !comments.length) return null

        const findCommentById = (
            commentId: string,
            commentsList: Comment[],
        ): Comment | null => {
            for (const comment of commentsList) {
                if (comment.id === commentId) {
                    return comment
                }

                if (comment.replies?.length) {
                    const foundInReplies = findCommentById(
                        commentId,
                        comment.replies as Comment[],
                    )
                    if (foundInReplies) {
                        return foundInReplies
                    }
                }
            }
            return null
        }

        return findCommentById(reportCommentId, comments)
    }, [comments, reportCommentId])

    const handleSortChange = useCallback(
        (value: string) => {
            const newSortOption = value as CommentSortOption
            if (newSortOption === sortOption) return
            setSortOption(newSortOption)
        },
        [sortOption],
    )

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value)
        },
        [],
    )

    const handleSearchSubmit = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.preventDefault()
                setCurrentSearch(searchQuery.trim())
            }
        },
        [searchQuery],
    )

    const handleSearchButtonClick = useCallback(() => {
        setCurrentSearch(searchQuery.trim())
    }, [searchQuery])

    const memoizedCommentsList = useMemo(() => {
        return (
            <CommentsList
                comments={comments}
                currentUserId={userId}
                locale={locale}
                onEdit={handleUpdateComment}
                onDelete={handleDeleteComment}
                onToggleLike={handleToggleLike}
                onReport={setReportCommentId}
                onReply={handleCreateComment}
                onShare={handleShareComment}
                setCommentRef={setCommentRef}
                newCommentIds={newCommentIds}
            />
        )
    }, [
        comments,
        userId,
        handleCreateComment,
        handleDeleteComment,
        handleToggleLike,
        handleUpdateComment,
        locale,
        newCommentIds,
        setCommentRef,
        setReportCommentId,
        handleShareComment,
    ])

    const LoaderSpinner = () => {
        return (
            <div className='flex h-[40vh] items-center justify-center'>
                <Spinner color='border-primary' size='lg' />
            </div>
        )
    }

    return (
        <div ref={commentsSectionRef}>
            {isAuthenticated ? (
                <>
                    {profile && (
                        <CommentForm
                            profile={profile as User}
                            onSubmit={handleCreateComment}
                        />
                    )}

                    <Separator className='my-4' />

                    {isLoadingComments && !comments.length ? (
                        <LoaderSpinner />
                    ) : (
                        <div className='w-full space-y-4'>
                            <div className='mb-4 flex flex-col items-center justify-between gap-2 sm:flex-row'>
                                <div className='relative w-full sm:w-64'>
                                    <Input
                                        placeholder={t('search.placeholder')}
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onKeyDown={handleSearchSubmit}
                                        className='bg-background pl-8 pr-10'
                                    />
                                    <div className='absolute left-2 top-1/2 -translate-y-1/2'>
                                        <Search className='size-4 text-muted-foreground' />
                                    </div>
                                </div>

                                {comments.length > 1 && (
                                    <div className='w-full sm:w-48'>
                                        <Select
                                            value={sortOption}
                                            onValueChange={handleSortChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={t(
                                                        'sort.placeholder',
                                                    )}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(
                                                    CommentSortOption,
                                                ).map(option => (
                                                    <SelectItem
                                                        key={option}
                                                        value={option}
                                                    >
                                                        {t(
                                                            `sort.${option.toLowerCase()}`,
                                                        )}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            {isLoading && !comments.length ? (
                                <LoaderSpinner />
                            ) : comments.length > 0 ? (
                                <div className='w-full overflow-visible'>
                                    <InfiniteScroll
                                        dataLength={comments.length}
                                        next={handleLoadMoreComments}
                                        hasMore={hasMore}
                                        loader={
                                            <div className='my-4 flex justify-center'>
                                                <Spinner color='border-primary' />
                                            </div>
                                        }
                                        endMessage={
                                            comments.length > 0 && (
                                                <div className='my-4 text-center text-sm text-muted-foreground'>
                                                    {t('endOfComments')}
                                                </div>
                                            )
                                        }
                                    >
                                        {memoizedCommentsList}
                                    </InfiniteScroll>
                                </div>
                            ) : currentSearch ? (
                                <EmptySearchState
                                    emptyMessage={t('search.noResults')}
                                />
                            ) : (
                                <div className='py-8 text-center'>
                                    <p>{t('empty')}</p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className='py-8 text-center'>
                    <Heading
                        title={t('authRequired.title')}
                        description={t('authRequired.description')}
                        size='sm'
                    />
                    <Button className='mt-4' asChild>
                        <Link href={AUTH_ROUTES.LOGIN}>
                            {t('authRequired.loginButton')}
                        </Link>
                    </Button>
                </div>
            )}

            {reportCommentId && (
                <ReportCommentDialog
                    isOpen={!!reportCommentId}
                    onClose={() => setReportCommentId(null)}
                    comment={reportComment() as Comment}
                    onReport={handleReportComment}
                />
            )}
        </div>
    )
}
