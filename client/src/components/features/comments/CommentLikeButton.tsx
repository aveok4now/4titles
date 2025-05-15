'use client'

import { Button } from '@/components/ui/common/button'
import { cn } from '@/utils/tw-merge'
import { ThumbsUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface CommentLikeButtonProps {
    count: number
    isLiked: boolean
    onClick: () => void
    disabled?: boolean
}

export function CommentLikeButton({
    count,
    isLiked,
    onClick,
    disabled = false,
}: CommentLikeButtonProps) {
    const t = useTranslations('components.comments.like')

    return (
        <Button
            variant='ghost'
            size='icon'
            className={cn(
                'px-1',
                'text-xs',
                isLiked && 'text-primary',
                disabled && 'opacity-70',
                count > 0 && 'px-2',
            )}
            onClick={onClick}
            disabled={disabled}
            title={disabled ? t('authRequired') : t('toggle')}
        >
            <ThumbsUp className={cn('size-3.5', isLiked && 'fill-current')} />
            {count > 0 && count}
        </Button>
    )
}
