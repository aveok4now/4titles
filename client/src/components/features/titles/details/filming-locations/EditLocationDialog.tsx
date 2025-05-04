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
import { Input } from '@/components/ui/common/input'
import { Separator } from '@/components/ui/common/separator'
import { Textarea } from '@/components/ui/common/textarea'
import { SubmitButton } from '@/components/ui/elements/SubmitButton'
import {
    FeedbackType,
    FilmingLocation,
    useSubmitFeedbackMutation,
} from '@/graphql/generated/output'
import { useAuth } from '@/hooks/useAuth'
import {
    editLocationSchema,
    EditLocationSchemaType,
} from '@/schemas/content/edit-location.schema'
import {
    createFormNotificationHandlers,
    showFormError,
} from '@/utils/form-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface EditLocationDialogProps {
    isOpen: boolean
    onClose: () => void
    location: NonNullable<FilmingLocation>
}

export function EditLocationDialog({
    isOpen,
    onClose,
    location,
}: EditLocationDialogProps) {
    const t = useTranslations('titleDetails.filmingLocations.editDialog')
    const { isAuthenticated } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (!isAuthenticated && isOpen) {
            showFormError(t('authRequiredMessage'))
            onClose()
        }
    }, [isAuthenticated, isOpen, onClose, t])

    const form = useForm<EditLocationSchemaType>({
        resolver: zodResolver(
            editLocationSchema({
                address: {
                    minLengthError: t('validationMessages.addressMinLength'),
                    maxLengthError: t('validationMessages.addressMaxLength'),
                },
                description: {
                    minLengthError: t(
                        'validationMessages.descriptionMinLength',
                    ),
                    maxLengthError: t(
                        'validationMessages.descriptionMaxLength',
                    ),
                },
                reason: {
                    minLengthError: t('validationMessages.reasonMinLength'),
                    maxLengthError: t('validationMessages.reasonMaxLength'),
                },
                atLeastOneThingShouldBeChanged: {
                    error: t(
                        'validationMessages.atLeastOneThingShouldBeChanged',
                    ),
                },
            }),
        ),
        defaultValues: {
            address: location.address,
            description: location.description || '',
            reason: '',
            originalAddress: location.address,
            originalDescription: location.description || '',
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

    const onSubmit = useCallback(
        (data: EditLocationSchemaType) => {
            if (!isAuthenticated) {
                showFormError(t('authRequiredMessage'))
                return
            }

            setIsSubmitting(true)
            const formattedMessage =
                `Предложение по обновлению локации: "${location.address}"\n\n` +
                `Текущий адрес: ${location.address}\n` +
                `Предлагаемый адрес: ${data.address}\n\n` +
                `Текущее описание: ${location.description || 'Отсутствует'}\n` +
                `Предлагаемое описание: ${data.description}\n\n` +
                `Причина изменения: ${data.reason}`

            submitFeedback({
                variables: {
                    data: {
                        message: formattedMessage,
                        type: FeedbackType.FeatureRequest,
                    },
                },
            })
        },
        [
            isAuthenticated,
            location.address,
            location.description,
            submitFeedback,
            t,
        ],
    )

    if (!isAuthenticated) return null

    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => {
                onClose()
                form.reset()
            }}
        >
            <DialogContent className='sm:max-w-lg'>
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
                            name='address'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('addressLabel')}</FormLabel>
                                    <Input {...field} />
                                    <div className='h-3.5 md:h-1'>
                                        <FormMessage className='text-xs' />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t('descriptionLabel')}
                                    </FormLabel>
                                    <Textarea
                                        placeholder={t(
                                            'descriptionPlaceholder',
                                        )}
                                        rows={8}
                                        className='resize-none'
                                        {...field}
                                    />
                                    <div className='h-3.5 md:h-1'>
                                        <FormMessage className='text-xs' />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='reason'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('reasonLabel')}</FormLabel>
                                    <Textarea
                                        placeholder={t('reasonPlaceholder')}
                                        rows={3}
                                        className='resize-none'
                                        {...field}
                                    />
                                    <div className='h-3.5 md:h-1'>
                                        <FormMessage className='text-xs' />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <Separator />

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
