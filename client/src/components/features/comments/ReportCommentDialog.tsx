'use client'

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/common/dialog'
import {
    Form,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/common/form'
import { Textarea } from '@/components/ui/common/textarea'
import { SubmitButton } from '@/components/ui/elements/SubmitButton'
import {
    Comment,
    FeedbackType,
    useSubmitAnonymousFeedbackMutation,
    useSubmitFeedbackMutation,
} from '@/graphql/generated/output'
import { useAuth } from '@/hooks/useAuth'
import {
    reportCommentSchema,
    ReportCommentSchemaType,
} from '@/schemas/content/report-comment.schema'
import {
    createFormNotificationHandlers,
    showFormError,
} from '@/utils/form-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

interface ReportCommentDialogProps {
    isOpen: boolean
    onClose: () => void
    comment: Comment | null
    onReport: (commentId: string, message: string) => void
}

export function ReportCommentDialog({
    isOpen,
    onClose,
    comment,
    onReport,
}: ReportCommentDialogProps) {
    const t = useTranslations('components.comments.reportDialog')
    const { isAuthenticated } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ReportCommentSchemaType>({
        resolver: zodResolver(
            reportCommentSchema({
                message: {
                    required: t('validationMessages.messageRequired'),
                    minLengthError: t('validationMessages.messageMinLength'),
                    maxLengthError: t('validationMessages.messageMaxLength'),
                },
            }),
        ),
        defaultValues: {
            message: '',
        },
    })

    const { handleSuccess, handleError } = createFormNotificationHandlers({
        successMessage: t('successMessage'),
        errorMessage: t('errorMessage'),
    })

    const handleLimitExceeded = useCallback(() => {
        showFormError(t('limitExceededMessage'), {
            description: t('limitExceededMessageDescription'),
        })
    }, [t])

    const [submitFeedback] = useSubmitFeedbackMutation({
        onCompleted(data) {
            if (data.submitFeedback.success) {
                handleSuccess()
                onClose()
                form.reset()
            } else if (
                data.submitFeedback.message?.includes(
                    'exceeded the daily feedback limit',
                )
            ) {
                handleLimitExceeded()
            } else {
                handleError()
            }
            setIsSubmitting(false)
        },
        onError() {
            handleError()
            setIsSubmitting(false)
        },
    })

    const [submitAnonymousFeedback] = useSubmitAnonymousFeedbackMutation({
        onCompleted(data) {
            if (data.submitAnonymousFeedback.success) {
                handleSuccess()
                onClose()
                form.reset()
            } else if (
                data.submitAnonymousFeedback.message?.includes('feedback limit')
            ) {
                handleLimitExceeded()
            } else {
                handleError()
            }
            setIsSubmitting(false)
        },
        onError() {
            handleError()
            setIsSubmitting(false)
        },
    })

    const onSubmit = useCallback(
        (data: ReportCommentSchemaType) => {
            if (!comment) return

            setIsSubmitting(true)

            const feedbackData = {
                message: `Жалоба на комментарий от ${comment.user?.username}:\n"${comment.message}"\n\nПричина: ${data.message}`,
                type: FeedbackType.CommentReport,
            }

            if (isAuthenticated) {
                submitFeedback({
                    variables: {
                        data: feedbackData,
                    },
                })
            } else {
                submitAnonymousFeedback({
                    variables: {
                        data: feedbackData,
                    },
                })
            }

            onReport(comment.id, data.message)
        },
        [
            comment,
            isAuthenticated,
            submitFeedback,
            submitAnonymousFeedback,
            onReport,
        ],
    )

    const handleClose = useCallback(() => {
        form.reset()
        onClose()
    }, [form, onClose])

    if (!comment) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>{t('heading')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex flex-col gap-4'
                    >
                        <FormField
                            control={form.control}
                            name='message'
                            render={({ field }) => (
                                <FormItem>
                                    <Textarea
                                        placeholder={t('messagePlaceholder')}
                                        rows={6}
                                        className='resize-none'
                                        {...field}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className='flex flex-col sm:flex-row'>
                            <SubmitButton
                                loading={isSubmitting}
                                disabled={
                                    !form.formState.isValid || isSubmitting
                                }
                                label={t('submitButton')}
                            />
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
