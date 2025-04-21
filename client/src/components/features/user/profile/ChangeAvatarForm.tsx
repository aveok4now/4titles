'use client'

import { Button } from '@/components/ui/common/button'
import { Form, FormField } from '@/components/ui/common/form'
import { Skeleton } from '@/components/ui/common/skeleton'
import { ConfirmDialog } from '@/components/ui/elements/ConfirmDialog'
import { FormWrapper } from '@/components/ui/elements/FormWrapper'
import { Hint } from '@/components/ui/elements/Hint'
import { ProfileAvatar } from '@/components/ui/elements/ProfileAvatar'
import {
    useChangeAvatarMutation,
    useRemoveAvatarMutation,
} from '@/graphql/generated/output'
import { useCurrent } from '@/hooks/useCurrent'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import {
    uploadFileSchema,
    UploadFileSchemaType,
} from '@/schemas/upload-file.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function ChangeAvatarForm() {
    const t = useTranslations('dashboard.settings.profile.avatar')
    const isMobile = useMediaQuery('(max-width: 1024px)')
    const { profile, isLoadingProfile, refetch } = useCurrent()

    const inputRef = useRef<HTMLInputElement>(null)
    const [isRemoveConfirmDialogOpen, setIsRemoveConfirmDialogOpen] =
        useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const form = useForm<UploadFileSchemaType>({
        resolver: zodResolver(uploadFileSchema),
        values: {
            file: undefined,
        },
    })

    useEffect(() => {
        if (profile) {
            form.reset({ file: undefined })
        }
    }, [profile, form])

    const [update, { loading: isLoadingAvatarUpdate }] =
        useChangeAvatarMutation({
            onCompleted: () => {
                setPreviewUrl(null)
                refetch()
                toast.success(t('successUpdateMessage'))
            },
            onError: () => {
                setPreviewUrl(null)
                toast.error(t('errorUpdateMessage'), {
                    description: t('errorUpdateMessageDescription'),
                })
            },
        })

    const [remove, { loading: isLoadingAvatarRemove }] =
        useRemoveAvatarMutation({
            onCompleted: () => {
                refetch()
                toast.success(t('successRemoveMessage'))
            },
            onError: () => {
                toast.error(t('errorRemoveMessage'), {
                    description: t('errorRemoveMessageDescription'),
                })
            },
        })

    function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]

        if (file) {
            const tempUrl = URL.createObjectURL(file)
            setPreviewUrl(tempUrl)

            update({ variables: { avatar: file } })

            if (inputRef.current) {
                inputRef.current.value = ''
            }
        }
    }

    const isLoading = isLoadingAvatarUpdate || isLoadingAvatarRemove

    return isLoadingProfile ? (
        <ChangeAvatarFormSkeleton />
    ) : (
        <FormWrapper heading={t('heading')}>
            <Form {...form}>
                <FormField
                    control={form.control}
                    name='file'
                    render={() => (
                        <div className='px-5 pb-5'>
                            <div className='w-full items-center space-x-0 sm:flex sm:space-x-6'>
                                <ProfileAvatar
                                    profile={{
                                        username: profile?.username!,
                                        avatar: previewUrl || profile?.avatar,
                                    }}
                                    size='xl'
                                />
                                <div className='mt-4 space-y-3'>
                                    <div className='flex items-center gap-x-3'>
                                        <input
                                            className='hidden'
                                            type='file'
                                            ref={inputRef}
                                            onChange={handleImageChange}
                                            accept='image/*'
                                        />
                                        <Button
                                            variant='secondary'
                                            onClick={() =>
                                                inputRef.current?.click()
                                            }
                                            disabled={isLoading}
                                            className='w-fit'
                                        >
                                            {isMobile
                                                ? t('smallUpdateButton')
                                                : t('updateButton')}
                                        </Button>

                                        {profile?.avatar && (
                                            <ConfirmDialog
                                                open={isRemoveConfirmDialogOpen}
                                                onOpenChange={
                                                    setIsRemoveConfirmDialogOpen
                                                }
                                                heading={t(
                                                    'confirmDialog.heading',
                                                )}
                                                message={t(
                                                    'confirmDialog.message',
                                                )}
                                                onConfirm={() => remove()}
                                            >
                                                <Hint
                                                    label={t('deleteButton')}
                                                    side='right'
                                                >
                                                    <Button
                                                        variant='ghost'
                                                        size='icon'
                                                        disabled={isLoading}
                                                    >
                                                        <Trash className='size-4' />
                                                    </Button>
                                                </Hint>
                                            </ConfirmDialog>
                                        )}
                                    </div>
                                    <p className='text-sm text-muted-foreground'>
                                        {t('info')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </Form>
        </FormWrapper>
    )
}

export function ChangeAvatarFormSkeleton() {
    return <Skeleton className='h-52 w-full' />
}
