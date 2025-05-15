'use client'

import type { Comment } from '@/graphql/generated/output'

import { CommentItem } from './CommentItem'

interface CommentsListProps {
    comments: Comment[]
    currentUserId?: string
    locale: string
    onEdit: (commentId: string, message: string) => void
    onDelete: (commentId: string) => void
    onToggleLike: (commentId: string) => void
    onReport: (commentId: string) => void
    onReply: (parentId: string, message: string) => void
    onShare?: (commentId: string) => void
    setCommentRef?: (id: string, el: HTMLDivElement | null) => void
    newCommentIds?: Set<string>
}

export function CommentsList({
    comments,
    currentUserId,
    locale,
    onEdit,
    onDelete,
    onToggleLike,
    onReport,
    onReply,
    onShare,
    setCommentRef,
    newCommentIds = new Set(),
}: CommentsListProps) {
    if (!comments.length) return null

    return (
        <div className='w-full space-y-4'>
            {comments.map(comment => (
                <div key={comment.id} className='w-full'>
                    <CommentItem
                        comment={comment}
                        currentUserId={currentUserId}
                        locale={locale}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onToggleLike={onToggleLike}
                        onReport={onReport}
                        onReply={onReply}
                        onShare={onShare}
                        setCommentRef={setCommentRef}
                        replies={comment.replies || []}
                        level={0}
                    />
                </div>
            ))}
        </div>
    )
}
