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
    FormLabel,
    FormMessage,
} from '@/components/ui/common/form'
import { Textarea } from '@/components/ui/common/textarea'
import { SubmitButton } from '@/components/ui/elements/SubmitButton'
import {
    FeedbackType,
    FilmingLocation,
    useSubmitAnonymousFeedbackMutation,
    useSubmitFeedbackMutation,
} from '@/graphql/generated/output'
import { useAuth } from '@/hooks/useAuth'
import {
    reportLocationSchema,
    ReportLocationSchemaType,
} from '@/schemas/content/report-location.schema'
import {
    createFormNotificationHandlers,
    showFormError,
} from '@/utils/form-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

interface ReportLocationDialogProps {
    isOpen: boolean
    onClose: () => void
    location: NonNullable<FilmingLocation>
}

export function ReportLocationDialog({
    isOpen,
    onClose,
    location,
}: ReportLocationDialogProps) {
    const t = useTranslations('titleDetails.filmingLocations.reportDialog')
    const { isAuthenticated } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ReportLocationSchemaType>({
        resolver: zodResolver(
            reportLocationSchema({
                message: {
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
        errorDescription: t('errorMessageDescription'),
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
        (data: ReportLocationSchemaType) => {
            setIsSubmitting(true)
            const feedbackData = {
                message: `Претензия к локации: "${location.address}"\n\n${data.message}`,
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
        [
            isAuthenticated,
            location.address,
            submitAnonymousFeedback,
            submitFeedback,
        ],
    )

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
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
                                    <FormLabel>{t('messageLabel')}</FormLabel>
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
