'use client'

import { Button } from '@/components/ui/common/button'
import { Textarea } from '@/components/ui/common/textarea'
import { ProfileAvatar } from '@/components/ui/elements/ProfileAvatar'
import { FindProfileQuery } from '@/graphql/generated/output'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

interface CommentFormProps {
    profile: Pick<FindProfileQuery['me'], 'username' | 'avatar'>
    onSubmit: (message: string, parentId?: string) => void
    onCancel?: () => void
    parentId?: string
    isReply?: boolean
    autoFocus?: boolean
    maxLength?: number
}

export function CommentForm({
    profile,
    onSubmit,
    onCancel,
    parentId,
    isReply = false,
    autoFocus = false,
    maxLength = 1000,
}: CommentFormProps) {
    const t = useTranslations('components.comments.form')
    const [message, setMessage] = useState('')
    const [isFocused, setIsFocused] = useState(autoFocus)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus()
        }
    }, [autoFocus])

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (
                e.key === 'Enter' &&
                (e.ctrlKey || e.metaKey) &&
                message.trim()
            ) {
                e.preventDefault()
                onSubmit(message, parentId)
                setMessage('')
            }
        },
        [message, onSubmit, parentId],
    )

    const handleSubmit = useCallback(() => {
        if (message.trim()) {
            onSubmit(message, parentId)
            setMessage('')
            setIsFocused(false)
        }
    }, [message, onSubmit, parentId])

    const handleCancel = useCallback(() => {
        setMessage('')
        setIsFocused(false)
        if (onCancel) onCancel()
    }, [onCancel])

    const characterCount = message.length
    const isOverLimit = characterCount > maxLength

    return (
        <div className='mb-4'>
            <div className='flex items-start gap-2 sm:gap-3'>
                <div className='mt-1'>
                    <ProfileAvatar profile={profile} size='sm' />
                </div>
                <div className='min-w-0 flex-1 space-y-2'>
                    <Textarea
                        ref={textareaRef}
                        placeholder={
                            isReply ? t('replyPlaceholder') : t('placeholder')
                        }
                        value={message}
                        onChange={e => {
                            if (e.target.value.length <= maxLength * 1.2) {
                                setMessage(e.target.value)
                            }
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                            if (!message.trim()) {
                                setIsFocused(false)
                            }
                        }}
                        onKeyDown={handleKeyDown}
                        className={`min-h-[60px] resize-none text-sm transition-all ${
                            isOverLimit ? 'border-destructive' : ''
                        }`}
                        maxLength={maxLength * 1.2}
                    />

                    <div className='flex flex-row items-start justify-between'>
                        <div className='flex h-4 flex-col items-start justify-start gap-y-1'>
                            <div className='text-xs text-muted-foreground'>
                                {characterCount > 0 && (
                                    <span
                                        className={
                                            isOverLimit
                                                ? 'text-destructive'
                                                : ''
                                        }
                                    >
                                        {characterCount}/{maxLength}
                                    </span>
                                )}
                                {isOverLimit && (
                                    <span className='ml-2 text-destructive'>
                                        {t('tooLong')}
                                    </span>
                                )}
                            </div>
                            <div className='hidden text-xs text-muted-foreground transition-all duration-200 sm:block'>
                                {message.length > 0 && (
                                    <>
                                        <span>
                                            {t('hint')}: {t('hintUse')}
                                        </span>{' '}
                                        <kbd className='rounded border px-1 py-0.5 text-xs'>
                                            Ctrl
                                        </kbd>
                                        {' + '}
                                        <kbd className='rounded border px-1 py-0.5 text-xs'>
                                            Enter
                                        </kbd>{' '}
                                        {t('hintForWhat')}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className='flex justify-end gap-2'>
                            {onCancel && (
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={handleCancel}
                                    className='h-8 px-2 text-xs sm:px-3'
                                >
                                    {t('cancel')}
                                </Button>
                            )}
                            <Button
                                size='sm'
                                onClick={handleSubmit}
                                disabled={!message.trim() || isOverLimit}
                                className='h-8 px-2 text-xs sm:px-3'
                            >
                                {isReply ? t('reply') : t('submit')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
