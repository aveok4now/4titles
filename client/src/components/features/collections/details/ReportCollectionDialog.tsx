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
    Collection,
    FeedbackType,
    useSubmitAnonymousFeedbackMutation,
    useSubmitFeedbackMutation,
} from '@/graphql/generated/output'
import { useAuth } from '@/hooks/useAuth'
import {
    reportCollectionSchema,
    ReportCollectionSchemaType,
} from '@/schemas/content/report-collection.schema'
import {
    createFormNotificationHandlers,
    showFormError,
} from '@/utils/form-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

interface ReportCollectionDialogProps {
    isOpen: boolean
    onClose: () => void
    collection: Collection | null
}

export function ReportCollectionDialog({
    isOpen,
    onClose,
    collection,
}: ReportCollectionDialogProps) {
    const t = useTranslations('collections.details.reportDialog')
    const { isAuthenticated } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ReportCollectionSchemaType>({
        resolver: zodResolver(
            reportCollectionSchema({
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
        (data: ReportCollectionSchemaType) => {
            if (!collection) return

            setIsSubmitting(true)

            const feedbackData = {
                message: `Претензия к коллекции "${collection.title}" от ${collection.user?.username}:\n\nПричина: ${data.message}`,
                type: FeedbackType.ContentIssue,
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
        },
        [collection, isAuthenticated, submitFeedback, submitAnonymousFeedback],
    )

    const handleClose = useCallback(() => {
        form.reset()
        onClose()
    }, [form, onClose])

    if (!collection) return null

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
                                        placeholder={t('messagePlaceholder', {
                                            title: collection.title,
                                        })}
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
