import { Button } from '@/components/ui/common/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from '@/components/ui/common/form'
import { Input } from '@/components/ui/common/input'
import ShinyText from '@/components/ui/custom/text/shiny-text'
import { Hint } from '@/components/ui/elements/Hint'
import {
    FindSocialLinksQuery,
    useFindSocialLinksQuery,
    useRemoveSocialLinkMutation,
    useUpdateSocialLinkMutation,
} from '@/graphql/generated/output'
import {
    socialLinksSchema,
    SocialLinksSchemaType,
} from '@/schemas/user/social-links.schema'
import { DraggableProvided } from '@hello-pangea/dnd'
import { zodResolver } from '@hookform/resolvers/zod'
import { GripVertical, Pencil, Trash } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface SocialLinkItemProps {
    socialLink: FindSocialLinksQuery['findSocialLinks'][0]
    provided: DraggableProvided
}

export function SocialLinkItem({ socialLink, provided }: SocialLinkItemProps) {
    const t = useTranslations('dashboard.settings.profile.socialLinks.editForm')

    const [editingId, setIsEditingId] = useState<string | null>(null)

    const { refetch } = useFindSocialLinksQuery()

    const form = useForm<SocialLinksSchemaType>({
        resolver: zodResolver(socialLinksSchema),
        values: {
            title: socialLink.title ?? '',
            url: socialLink.url ?? '',
        },
    })

    const { isValid, isDirty } = form.formState

    function toggleEditing(id: string | null) {
        setIsEditingId(id)
    }

    const [update, { loading: isLoadingSocialLinkUpdate }] =
        useUpdateSocialLinkMutation({
            onCompleted() {
                toggleEditing(null)
                refetch()
                toast.success(t('successUpdateMessage'))
            },
            onError() {
                toast.error(t('errorUpdateMessage'))
            },
        })

    const [remove, { loading: isLoadingSocialLinkRemove }] =
        useRemoveSocialLinkMutation({
            onCompleted() {
                refetch()
                toast.success(t('successRemoveMessage'))
            },
            onError() {
                toast.error(t('errorRemoveMessage'))
            },
        })

    const handleSubmit = useCallback(
        (data: SocialLinksSchemaType) => {
            if (isValid && isDirty) {
                update({
                    variables: { updateSocialLinkId: socialLink.id, data },
                })
            }
        },
        [update, socialLink.id, isValid, isDirty],
    )

    const handleRemove = useCallback(() => {
        remove({
            variables: { removeSocialLinkId: socialLink.id },
        })
    }, [remove, socialLink.id])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (
            e.key === 'Enter' &&
            !e.shiftKey &&
            isValid &&
            isDirty &&
            !isLoading
        ) {
            e.preventDefault()
            form.handleSubmit(handleSubmit)()
        }
    }

    const isLoading = isLoadingSocialLinkUpdate || isLoadingSocialLinkRemove

    return (
        <div
            className='mb-4 flex max-w-full items-center gap-x-2 overflow-x-auto rounded-md border border-border bg-background text-sm'
            ref={provided.innerRef}
            {...provided.draggableProps}
        >
            <div
                className='rounded-l-md border-r border-r-border px-2 py-9 text-foreground transition'
                {...provided.dragHandleProps}
            >
                <GripVertical className='size-5' />
            </div>

            <div className='space-y-1 px-2'>
                {editingId === socialLink.id ? (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className='flex gap-x-6'
                            onKeyDown={handleKeyDown}
                        >
                            <div className='w-96 space-y-2'>
                                <FormField
                                    control={form.control}
                                    name='title'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        'titlePlaceholder',
                                                    )}
                                                    disabled={isLoading}
                                                    className='h-8'
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='url'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        'urlPlaceholder',
                                                    )}
                                                    disabled={isLoading}
                                                    className='h-8'
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='flex items-center gap-x-4'>
                                <Button
                                    onClick={() => toggleEditing(null)}
                                    variant='secondary'
                                    type='button'
                                >
                                    {t('cancelButton')}
                                </Button>
                                <Button
                                    disabled={!isDirty || !isValid || isLoading}
                                    type='submit'
                                >
                                    {t('submitButton')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                ) : (
                    <>
                        <ShinyText
                            text={socialLink.title}
                            className='text-xs font-bold text-foreground/85 lg:text-lg'
                            speed={8}
                        />
                        <p className='lg:text-md text-xs text-muted-foreground'>
                            {socialLink.url}
                        </p>
                    </>
                )}
            </div>
            <div className='ml-auto flex flex-col items-center gap-x-1 pr-0 lg:flex-row lg:pr-4'>
                {editingId !== socialLink.id && (
                    <Hint label={t('editButton')} side='left'>
                        <Button
                            onClick={() => toggleEditing(socialLink.id)}
                            variant='ghost'
                            size='icon'
                        >
                            <Pencil className='size-4' />
                        </Button>
                    </Hint>
                )}
                <Hint label={t('deleteButton')} side='right'>
                    <Button onClick={handleRemove} variant='ghost' size='icon'>
                        <Trash className='size-4' />
                    </Button>
                </Hint>
            </div>
        </div>
    )
}
