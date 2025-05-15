'use client'

import {
    CommentableType,
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
import { Separator } from '@/components/ui/common/separator'
import { Heading } from '@/components/ui/elements/Heading'
import { Link } from '@/components/ui/elements/Link'
import { Spinner } from '@/components/ui/elements/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { useCurrent } from '@/hooks/useCurrent'
import { AUTH_ROUTES } from '@/libs/constants/auth.constants'
import { DEFAULT_LANGUAGE } from '@/libs/i18n/config'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
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

const COMMENTS_PER_PAGE = 24

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

    const commentRefsMap = useRef(new Map<string, HTMLDivElement>())

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

    const addCommentToTree = useCallback(
        (
            commentsArray: Comment[],
            newComment: Comment,
            parentId?: string,
        ): Comment[] => {
            if (!parentId) {
                return [newComment, ...commentsArray]
            }

            return commentsArray.map(comment => {
                if (comment.id === parentId) {
                    const currentReplies = comment.replies || []
                    return {
                        ...comment,
                        replies: [newComment, ...(currentReplies as Comment[])],
                    }
                }

                if (comment.replies?.length) {
                    return {
                        ...comment,
                        replies: addCommentToTree(
                            comment.replies as Comment[],
                            newComment,
                            parentId,
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

    const [createComment] = useCreateCommentMutation({
        onCompleted: () => {
            toast.success(t('notifications.createSuccess'))
            refetchCommentsAndUpdate()
        },
        onError: () => {
            toast.error(t('notifications.createError'))
        },
    })

    const refetchCommentsAndUpdate = useCallback(async () => {
        try {
            setIsLoading(true)
            const { data } = await refetch({
                filter: {
                    commentableId,
                    commentableType,
                    take: COMMENTS_PER_PAGE,
                    skip: 0,
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
    }, [commentableId, commentableType, refetch, t])

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

    const handleLoadMoreComments = useCallback(async () => {
        if (isLoading || !hasMore) return

        setIsLoading(true)

        try {
            const { data } = await fetchMore({
                variables: {
                    filter: {
                        commentableId,
                        commentableType,
                        take: COMMENTS_PER_PAGE,
                        skip: loadedCount,
                    },
                },
            })

            if (data?.findComments && data.findComments.length > 0) {
                const newComments = data.findComments as Comment[]

                const existingIdsMap = new Map(comments.map(c => [c.id, true]))

                const uniqueNewComments = newComments.filter(
                    newComment => !existingIdsMap.has(newComment.id),
                )

                if (uniqueNewComments.length > 0) {
                    const newIds = new Set(uniqueNewComments.map(c => c.id))
                    setNewCommentIds(newIds)

                    setComments(prevComments => {
                        const updatedComments = [
                            ...prevComments,
                            ...uniqueNewComments,
                        ]
                        return updatedComments
                    })

                    setLoadedCount(prev => {
                        const newCount = prev + uniqueNewComments.length
                        return newCount
                    })

                    setHasMore(newComments.length === COMMENTS_PER_PAGE)

                    toast.success(
                        t('notifications.loadedNewComments', {
                            count: uniqueNewComments.length,
                        }),
                    )
                } else {
                    setHasMore(false)
                    toast.info(t('notifications.noMoreComments'))
                }
            } else {
                setHasMore(false)
                toast.info(t('notifications.noMoreComments'))
            }
        } catch (error) {
            toast.error(t('notifications.loadMoreError'))
        } finally {
            setIsLoading(false)
        }
    }, [
        commentableId,
        commentableType,
        loadedCount,
        isLoading,
        hasMore,
        fetchMore,
        comments,
        t,
    ])

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

    return (
        <>
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
                        <div className='py-8 text-center'>
                            <p>{t('loading')}</p>
                        </div>
                    ) : comments.length > 0 ? (
                        <div className='w-full space-y-4'>
                            <div className='w-full overflow-hidden'>
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
                            </div>

                            {hasMore && (
                                <div className='mt-4 text-center'>
                                    <Button
                                        variant='outline'
                                        onClick={handleLoadMoreComments}
                                        disabled={isLoading}
                                        className='min-w-32'
                                    >
                                        {isLoading ? (
                                            <Spinner />
                                        ) : (
                                            t('loadMore')
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='py-8 text-center'>
                            <p>{t('empty')}</p>
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
        </>
    )
}
