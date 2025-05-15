'use client'

import type { Comment, User } from '@/graphql/generated/output'

import { Button } from '@/components/ui/common/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/common/dropdown-menu'
import { Separator } from '@/components/ui/common/separator'
import { Textarea } from '@/components/ui/common/textarea'
import { ConfirmDialog } from '@/components/ui/elements/ConfirmDialog'
import { ProfileAvatar } from '@/components/ui/elements/ProfileAvatar'
import { Spinner } from '@/components/ui/elements/Spinner'
import { useFindCommentByIdLazyQuery } from '@/graphql/generated/output'
import { useAuth } from '@/hooks/useAuth'
import { useCurrent } from '@/hooks/useCurrent'
import { formatTimeAgo } from '@/utils/date/format-time-ago'
import {
    ChevronDown,
    ChevronUp,
    Flag,
    Forward,
    MoreHorizontal,
    Pencil,
    Reply,
    Trash,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CommentForm } from './CommentForm'
import { CommentLikeButton } from './CommentLikeButton'

const commentVisibilityContext = new WeakMap<Comment, boolean>()

interface CommentItemProps {
    comment: Comment
    currentUserId?: string
    locale: string
    onEdit: (commentId: string, message: string) => void
    onDelete: (commentId: string) => void
    onToggleLike: (commentId: string) => void
    onReport: (commentId: string) => void
    onReply: (message: string, parentId: string) => void
    onShare?: (commentId: string) => void
    isReply?: boolean
    setCommentRef?: (id: string, el: HTMLDivElement | null) => void
    replies?: Comment[]
    level?: number
    initialHidden?: boolean
}

export function CommentItem({
    comment,
    currentUserId,
    locale,
    onEdit,
    onDelete,
    onToggleLike,
    onReport,
    onReply,
    onShare,
    isReply = false,
    setCommentRef,
    replies = [],
    level = 0,
    initialHidden,
}: CommentItemProps) {
    const t = useTranslations('components.comments')
    const { isAuthenticated } = useAuth()
    const { profile } = useCurrent()
    const commentRef = useRef<HTMLDivElement>(null)

    const [isEditing, setIsEditing] = useState(false)
    const [editedMessage, setEditedMessage] = useState(comment.message)
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
    const [isReplying, setIsReplying] = useState(false)
    const [isLoadingMoreReplies, setIsLoadingMoreReplies] = useState(false)
    const [deepReplies, setDeepReplies] = useState<Comment[]>([])

    const savedHiddenState = commentVisibilityContext.get(comment)
    const [areChildrenHidden, setAreChildrenHidden] = useState(
        savedHiddenState !== undefined
            ? savedHiddenState
            : (initialHidden ?? false),
    )

    const areChildrenHiddenRef = useRef(areChildrenHidden)

    useEffect(() => {
        areChildrenHiddenRef.current = areChildrenHidden
        commentVisibilityContext.set(comment, areChildrenHidden)
    }, [comment, areChildrenHidden])

    useEffect(() => {
        if (commentRef.current && setCommentRef) {
            const frame = requestAnimationFrame(() => {
                setCommentRef(comment.id, commentRef.current)
            })
            return () => cancelAnimationFrame(frame)
        }
    }, [comment.id, setCommentRef])

    const [loadDeepComment] = useFindCommentByIdLazyQuery({
        fetchPolicy: 'network-only',
        onCompleted: data => {
            if (data?.findCommentById?.replies?.length) {
                const newReplies = data.findCommentById.replies as Comment[]
                const existingRepliesMap = new Map(
                    (commentReplies || []).map(reply => [reply.id, reply]),
                )

                const combinedReplies = [...commentReplies]

                newReplies.forEach(reply => {
                    const existingIndex = combinedReplies.findIndex(
                        item => item.id === reply.id,
                    )

                    if (existingIndex >= 0) {
                        combinedReplies[existingIndex] = reply
                    } else {
                        combinedReplies.push(reply)
                    }
                })

                setDeepReplies(combinedReplies)
            }
            setIsLoadingMoreReplies(false)
        },
        onError: () => {
            setIsLoadingMoreReplies(false)
        },
    })

    const isAuthor = currentUserId === comment.user?.id
    const commentReplies = Array.isArray(replies) ? replies : []
    const hasReplies = commentReplies.length > 0
    const allReplies = deepReplies.length > 0 ? deepReplies : commentReplies
    const repliesCount = comment.totalReplies ?? commentReplies.length

    const MAX_VISUAL_NESTING = 3
    const createdAtFormatted = formatTimeAgo(comment.createdAt, locale)

    const hasDeepReplies = useCallback(
        (comment: Comment): boolean => {
            if (deepReplies.length > 0) {
                return false
            }

            if (!comment.replies?.length) return false

            const checkDeepReplies = (
                replies: Comment[],
                currentLevel: number,
            ): boolean => {
                if (currentLevel >= 5) {
                    return replies.some(reply => reply.totalReplies > 0)
                }

                return replies.some(
                    reply =>
                        reply.replies &&
                        checkDeepReplies(
                            reply.replies as Comment[],
                            currentLevel + 1,
                        ),
                )
            }

            return checkDeepReplies(comment.replies as Comment[], 1)
        },
        [deepReplies.length],
    )

    const handleLoadDeepReplies = useCallback(() => {
        const findDeepCommentId = (
            replies: Comment[],
            currentLevel = 1,
        ): string | null => {
            for (const reply of replies) {
                if (
                    reply.totalReplies > 0 &&
                    (!reply.replies ||
                        reply.replies.length < reply.totalReplies)
                ) {
                    return reply.id
                }
            }

            if (currentLevel >= 5) {
                const replyWithChildren = replies.find(
                    reply => reply.totalReplies > 0,
                )
                return replyWithChildren ? replyWithChildren.id : null
            }

            for (const reply of replies) {
                if (reply.replies?.length) {
                    const deepId = findDeepCommentId(
                        reply.replies as Comment[],
                        currentLevel + 1,
                    )
                    if (deepId) return deepId
                }
            }
            return null
        }

        if (!comment.replies?.length) return

        const deepCommentId = findDeepCommentId(comment.replies as Comment[])
        if (deepCommentId) {
            setIsLoadingMoreReplies(true)
            loadDeepComment({
                variables: { id: deepCommentId },
                fetchPolicy: 'network-only',
            })
        }
    }, [comment.replies, loadDeepComment])

    const handleEditClick = useCallback(() => {
        setEditedMessage(comment.message)
        setIsEditing(true)
    }, [comment.message])

    const handleCancelEdit = useCallback(() => {
        setIsEditing(false)
        setEditedMessage(comment.message)
    }, [comment.message])

    const handleSaveEdit = useCallback(() => {
        if (editedMessage.trim() && editedMessage.trim() !== comment.message) {
            onEdit(comment.id, editedMessage)
        }
        setIsEditing(false)
    }, [editedMessage, comment.id, comment.message, onEdit])

    const handleDelete = useCallback(() => {
        setIsConfirmDeleteOpen(true)
    }, [])

    const handleConfirmDelete = useCallback(() => {
        onDelete(comment.id)
        setIsConfirmDeleteOpen(false)
    }, [comment.id, onDelete])

    const handleReply = useCallback(() => {
        setIsReplying(prev => !prev)
    }, [])

    const handleShare = useCallback(() => {
        if (onShare) onShare(comment.id)
    }, [comment.id, onShare])

    const handleSubmitReply = useCallback(
        (message: string) => {
            onReply(message, comment.id)
            setIsReplying(false)
            setAreChildrenHidden(false)
        },
        [comment.id, onReply],
    )

    const toggleRepliesVisibility = useCallback(() => {
        if (!areChildrenHidden) {
            setDeepReplies([])
        }
        setAreChildrenHidden(prev => !prev)
    }, [areChildrenHidden])

    return (
        <div
            className='relative mb-4 max-w-full'
            id={`comment-${comment.id}`}
            ref={commentRef}
        >
            <div className='flex gap-2 overflow-hidden'>
                <div className='flex-shrink-0 self-start pt-1'>
                    <Link href={`/${comment.user?.username}`}>
                        <ProfileAvatar profile={comment.user} size='sm' />
                    </Link>
                </div>

                <div className='min-w-0 flex-1 space-y-1'>
                    <div className='flex flex-wrap items-center justify-between gap-1 sm:flex-nowrap'>
                        <div className='flex max-w-[calc(100%-40px)] flex-wrap items-center gap-1 sm:gap-2'>
                            <Link
                                href={`/${comment.user?.username}`}
                                className='max-w-[120px] truncate text-sm font-semibold hover:underline sm:max-w-none'
                            >
                                {comment.user?.username}
                            </Link>
                            <span className='hidden text-muted-foreground sm:inline'>
                                •
                            </span>
                            <span className='whitespace-nowrap text-xs text-muted-foreground'>
                                {createdAtFormatted}
                            </span>
                        </div>

                        {!isEditing && (
                            <div className='mr-1 mt-1'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            className='border-none focus:outline-none'
                                        >
                                            <MoreHorizontal className='size-4' />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align='end'
                                        className='w-40'
                                    >
                                        {isAuthor && (
                                            <>
                                                <DropdownMenuItem
                                                    onClick={handleEditClick}
                                                >
                                                    <Pencil className='mr-2 size-4' />
                                                    {t('options.edit')}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={handleDelete}
                                                >
                                                    <Trash className='mr-2 size-4' />
                                                    {t('options.delete')}
                                                </DropdownMenuItem>
                                                <Separator />
                                            </>
                                        )}
                                        {onShare && (
                                            <DropdownMenuItem
                                                onClick={handleShare}
                                            >
                                                <Forward className='mr-2 size-4' />
                                                {t('share')}
                                            </DropdownMenuItem>
                                        )}
                                        {!isAuthor && (
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    onReport(comment.id)
                                                }
                                            >
                                                <Flag className='mr-2 size-4' />
                                                {t('options.report')}
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className='space-y-2'>
                            <Textarea
                                value={editedMessage}
                                onChange={e => setEditedMessage(e.target.value)}
                                className='min-h-[60px]'
                            />
                            <div className='flex justify-end gap-2'>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCancelEdit}
                                >
                                    {t('edit.cancel')}
                                </Button>
                                <Button
                                    size='sm'
                                    onClick={handleSaveEdit}
                                    disabled={
                                        !editedMessage.trim() ||
                                        editedMessage.trim() === comment.message
                                    }
                                >
                                    {t('edit.save')}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className='break-words text-sm text-foreground'>
                            {comment.message}
                        </p>
                    )}

                    {!isEditing && (
                        <div className='flex flex-wrap items-center gap-x-1 text-muted-foreground sm:gap-x-2'>
                            <CommentLikeButton
                                count={comment.likeCount}
                                isLiked={comment.likedByMe}
                                onClick={() => onToggleLike(comment.id)}
                                disabled={!isAuthenticated}
                            />

                            <Button
                                variant='ghost'
                                size='sm'
                                className='h-7 px-1 text-xs sm:h-8 sm:px-2'
                                onClick={handleReply}
                                disabled={!isAuthenticated}
                            >
                                <Reply className='mr-1 size-3' />
                                {t('reply.title')}
                            </Button>
                        </div>
                    )}

                    {hasReplies && (
                        <div className='mt-1 sm:mt-2'>
                            <Button
                                variant='ghost'
                                size='sm'
                                className='h-6 px-1 text-xs sm:px-2'
                                onClick={toggleRepliesVisibility}
                            >
                                {areChildrenHidden ? (
                                    <ChevronDown className='mr-1 size-3' />
                                ) : (
                                    <ChevronUp className='mr-1 size-3' />
                                )}
                                {areChildrenHidden
                                    ? t('toggleReplies.show', {
                                          count: repliesCount,
                                      })
                                    : t('toggleReplies.hide')}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {isReplying && isAuthenticated && profile && (
                <div className='relative mt-2 flex'>
                    <div className='absolute left-4 top-0 h-full'>
                        <Separator orientation='vertical' className='h-full' />
                    </div>
                    <div className='ml-8 w-full pl-2 sm:pl-4'>
                        <div className='mb-2 text-xs sm:text-sm'>
                            <span className='text-muted-foreground'>
                                {t('reply.replyingTo')}
                            </span>{' '}
                            <span className='font-semibold'>
                                {comment.user?.username}
                            </span>
                        </div>
                        <CommentForm
                            profile={profile as User}
                            onSubmit={handleSubmitReply}
                            onCancel={() => setIsReplying(false)}
                            isReply
                            autoFocus
                        />
                    </div>
                </div>
            )}

            {!areChildrenHidden && hasReplies && (
                <div className='relative w-full'>
                    {level < MAX_VISUAL_NESTING ? (
                        <div className='relative flex w-full max-w-full'>
                            <div className='absolute left-4 top-0 h-full'>
                                <Separator
                                    orientation='vertical'
                                    className='h-full'
                                />
                            </div>
                            <div className='ml-6 mt-3 w-full max-w-[calc(100%-8px)] space-y-3 overflow-hidden pl-2 sm:ml-8 sm:pl-4'>
                                {allReplies.map(reply => (
                                    <CommentItem
                                        key={reply.id}
                                        comment={reply}
                                        currentUserId={currentUserId}
                                        locale={locale}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onToggleLike={onToggleLike}
                                        onReport={onReport}
                                        onReply={onReply}
                                        onShare={onShare}
                                        setCommentRef={setCommentRef}
                                        isReply
                                        replies={reply.replies || []}
                                        level={level + 1}
                                        initialHidden={commentVisibilityContext.get(
                                            reply,
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className='mt-2 w-full space-y-2 pl-0 sm:mt-3 sm:space-y-3 sm:pl-2'>
                            {allReplies.map(reply => (
                                <div
                                    key={reply.id}
                                    className='relative w-full max-w-full border-l-2 border-muted pl-2 pt-2 sm:pl-3'
                                >
                                    <CommentItem
                                        comment={reply}
                                        currentUserId={currentUserId}
                                        locale={locale}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onToggleLike={onToggleLike}
                                        onReport={onReport}
                                        onReply={onReply}
                                        onShare={onShare}
                                        setCommentRef={setCommentRef}
                                        isReply
                                        replies={reply.replies || []}
                                        level={level + 1}
                                        initialHidden={commentVisibilityContext.get(
                                            reply,
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {hasDeepReplies(comment) && !isLoadingMoreReplies && (
                        <div className='mt-3 text-center sm:mt-4'>
                            <Button
                                variant='outline'
                                size='sm'
                                className='mx-auto flex items-center gap-1 text-xs sm:text-sm'
                                onClick={handleLoadDeepReplies}
                            >
                                <ChevronDown className='size-3 sm:size-4' />
                                {t('loadMoreReplies')}
                            </Button>
                        </div>
                    )}

                    {isLoadingMoreReplies && (
                        <div className='mx-auto mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground sm:mt-4 sm:text-sm'>
                            <Spinner />
                        </div>
                    )}
                </div>
            )}

            <ConfirmDialog
                heading={t('deleteDialog.heading')}
                message={t('deleteDialog.message')}
                onConfirm={handleConfirmDelete}
                open={isConfirmDeleteOpen}
                onOpenChange={setIsConfirmDeleteOpen}
            />
        </div>
    )
}
