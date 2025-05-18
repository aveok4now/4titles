'use client'

import { Button } from '@/components/ui/common/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/common/form'
import { Input } from '@/components/ui/common/input'
import {
    ComboboxOption,
    ResponsiveCombobox,
} from '@/components/ui/common/responsive-combobox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/common/select'
import { Switch } from '@/components/ui/common/switch'
import { Textarea } from '@/components/ui/common/textarea'
import { Heading } from '@/components/ui/elements/Heading'
import {
    Collection,
    CollectionType,
    FilmingLocation,
    LocationCollectionItemInput,
    Title,
    TitleCollectionItemInput,
    useCreateCollectionMutation,
    useFindFilmingLocationsQuery,
    useFindTitlesQuery,
    useRemoveCollectionCoverImageMutation,
    useUpdateCollectionMutation,
} from '@/graphql/generated/output'
import {
    CollectionFormValues,
    collectionSchema,
} from '@/schemas/collection.schema'
import { getMediaSource } from '@/utils/get-media-source'
import { getLocalizedTitleName } from '@/utils/title/title-localization'
import { cn } from '@/utils/tw-merge'
import { useApolloClient } from '@apollo/client'

import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from '@hello-pangea/dnd'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    ArrowLeft,
    GripVertical,
    Info,
    Loader2,
    Pencil,
    Save,
    Trash2,
    Upload,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { TitleBackdropCard } from '../../titles/TitleBackdropCard'

interface CollectionFormProps {
    initialCollection?: Collection
    onComplete?: () => void
    onCancel?: () => void
}

export function CollectionForm({
    initialCollection,
    onComplete,
    onCancel,
}: CollectionFormProps) {
    const t = useTranslations('collections.form')
    const locale = useLocale()
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const apolloClient = useApolloClient()

    const isEditMode = !!initialCollection
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [coverImageFile, setCoverImageFile] = useState<File | undefined>(
        undefined,
    )
    const [coverImagePreview, setCoverImagePreview] = useState<
        string | undefined
    >(
        initialCollection?.coverImage
            ? getMediaSource(initialCollection.coverImage)
            : undefined,
    )
    const [wasImageRemoved, setWasImageRemoved] = useState(false)

    const [titlesSearchTerm, setTitlesSearchTerm] = useState('')
    const [locationsSearchTerm, setLocationsSearchTerm] = useState('')

    const [selectedTitles, setSelectedTitles] = useState<Title[]>(
        initialCollection?.titleItems
            ?.map(item => item.title as Title)
            .filter(Boolean) || [],
    )
    const [selectedLocations, setSelectedLocations] = useState<
        FilmingLocation[]
    >(
        initialCollection?.locationItems
            ?.map(item => item.location as FilmingLocation)
            .filter(Boolean) || [],
    )

    const defaultValues: CollectionFormValues = {
        id: initialCollection?.id,
        title: initialCollection?.title || '',
        description: initialCollection?.description || '',
        isPrivate: initialCollection?.isPrivate ?? false,
        type: initialCollection?.type || CollectionType.Title,
        coverImage: undefined,
        titleItems:
            initialCollection?.titleItems?.map(item => item.title.id) || [],
        locationItems:
            initialCollection?.locationItems?.map(item => item.location.id) ||
            [],
    }

    const form = useForm({
        resolver: zodResolver(
            collectionSchema({
                title: {
                    minLengthError: t('validationMessages.title.minLength'),
                    maxLengthError: t('validationMessages.title.maxLength'),
                },
                description: {
                    maxLengthError: t(
                        'validationMessages.description.maxLength',
                    ),
                },
            }),
        ),
        defaultValues,
    })

    const watchType = form.watch('type')

    const {
        data: titlesData,
        loading: titlesLoading,
        fetchMore: fetchMoreTitles,
    } = useFindTitlesQuery({
        variables: {
            filter: {
                searchTerm: titlesSearchTerm,
                take: 10,
            },
        },
        skip: !titlesSearchTerm || watchType !== CollectionType.Title,
    })

    const {
        data: locationsData,
        loading: locationsLoading,
        fetchMore: fetchMoreLocations,
    } = useFindFilmingLocationsQuery({
        variables: {
            input: {
                search: locationsSearchTerm,
                take: 10,
            },
        },
        skip: !locationsSearchTerm || watchType !== CollectionType.Location,
    })

    const [removeCollectionCoverImage] = useRemoveCollectionCoverImageMutation()

    const [createCollection] = useCreateCollectionMutation({
        onCompleted: () => {
            toast.success(t('messages.createSuccess'))
            setIsSubmitting(false)
            router.push('/collections')
            if (onComplete) onComplete()
        },
        onError: error => {
            toast.error(t('messages.createError'))
            setIsSubmitting(false)
            console.error('Error creating collection:', error)
        },
    })

    const [updateCollection] = useUpdateCollectionMutation({
        onCompleted: () => {
            toast.success(t('messages.updateSuccess'))
            setIsSubmitting(false)
            if (onComplete) onComplete()
        },
        onError: error => {
            toast.error(t('messages.updateError'))
            setIsSubmitting(false)
            console.error('Error updating collection:', error)
        },
    })

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setCoverImageFile(file)
            setWasImageRemoved(false)

            const fileUrl = URL.createObjectURL(file)
            setCoverImagePreview(fileUrl)

            form.setValue('coverImage', file)
        }
    }

    const handleOpenFileDialog = () => {
        fileInputRef.current?.click()
    }

    const handleRemoveImage = () => {
        setCoverImageFile(undefined)
        setCoverImagePreview(undefined)
        form.setValue('coverImage', undefined)
        setWasImageRemoved(true)

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleTitleDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(selectedTitles)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setSelectedTitles(items)
        form.setValue(
            'titleItems',
            items.map(title => title.id),
        )
    }

    const handleLocationDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(selectedLocations)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setSelectedLocations(items)
        form.setValue(
            'locationItems',
            items.map(location => location.id),
        )
    }

    const handleTitleSearch = (value: string) => {
        setTitlesSearchTerm(value)
    }

    const handleLocationSearch = (value: string) => {
        setLocationsSearchTerm(value)
    }

    const handleTitlesSelect = (selectedIds: string[]) => {
        const searchResults = titlesData?.findTitles || []

        const existingTitlesMap = new Map(
            selectedTitles.map(title => [title.id, title]),
        )

        const remainingTitles = selectedTitles.filter(title =>
            selectedIds.includes(title.id),
        )

        const newTitlesFromSearch = searchResults
            .filter(
                title =>
                    selectedIds.includes(title.id) &&
                    !existingTitlesMap.has(title.id),
            )
            .map(title => title as Title)

        const updatedTitles = [...remainingTitles, ...newTitlesFromSearch]

        const sortedTitles = selectedIds
            .map(id => updatedTitles.find(title => title.id === id))
            .filter(Boolean) as Title[]

        setSelectedTitles(sortedTitles)
        form.setValue('titleItems', selectedIds)
    }

    const handleLocationsSelect = (selectedIds: string[]) => {
        const searchResults = locationsData?.findFilmingLocations || []

        const existingLocationsMap = new Map(
            selectedLocations.map(location => [location.id, location]),
        )

        const remainingLocations = selectedLocations.filter(location =>
            selectedIds.includes(location.id),
        )

        const newLocationsFromSearch = searchResults
            .filter(
                location =>
                    selectedIds.includes(location.id) &&
                    !existingLocationsMap.has(location.id),
            )
            .map(location => location as FilmingLocation)

        const updatedLocations = [
            ...remainingLocations,
            ...newLocationsFromSearch,
        ]

        const sortedLocations = selectedIds
            .map(id => updatedLocations.find(location => location.id === id))
            .filter(Boolean) as FilmingLocation[]

        setSelectedLocations(sortedLocations)
        form.setValue('locationItems', selectedIds)
    }

    const titlesOptions: ComboboxOption[] = [
        ...selectedTitles.map(title => ({
            value: title.id,
            label: getLocalizedTitleName(title, locale),
        })),
        ...(titlesData?.findTitles
            .filter(title => !selectedTitles.some(t => t.id === title.id))
            .map(title => ({
                value: title.id,
                label: getLocalizedTitleName(title as Title, locale),
            })) || []),
    ]

    const locationsOptions: ComboboxOption[] = [
        ...selectedLocations.map(location => ({
            value: location.id,
            label: location.formattedAddress || location.address,
        })),
        ...(locationsData?.findFilmingLocations
            .filter(
                location => !selectedLocations.some(l => l.id === location.id),
            )
            .map(location => ({
                value: location.id,
                label: location.formattedAddress || location.address,
            })) || []),
    ]

    const onSubmit = async (data: CollectionFormValues) => {
        setIsSubmitting(true)

        let titleItems: TitleCollectionItemInput[] = []
        let locationItems: LocationCollectionItemInput[] = []

        if (data.type === CollectionType.Title && selectedTitles.length > 0) {
            titleItems = selectedTitles.map((title, index) => ({
                titleId: title.id,
                position: index + 1,
            }))
        } else if (
            data.type === CollectionType.Location &&
            selectedLocations.length > 0
        ) {
            locationItems = selectedLocations.map((location, index) => ({
                locationId: location.id,
                position: index + 1,
            }))
        }

        try {
            if (isEditMode && initialCollection) {
                if (wasImageRemoved && initialCollection?.coverImage) {
                    await removeCollectionCoverImage({
                        variables: {
                            removeCollectionCoverImageId: initialCollection.id,
                        },
                    })
                }

                const updateInput = {
                    id: initialCollection.id,
                    title: data.title,
                    description: data.description || null,
                    isPrivate: data.isPrivate,
                    titleItems: titleItems.length > 0 ? titleItems : undefined,
                    locationItems:
                        locationItems.length > 0 ? locationItems : undefined,
                }

                const variables: any = { input: updateInput }

                if (coverImageFile) {
                    variables.coverImage = coverImageFile
                }

                const result = await updateCollection({ variables })

                if (result.data?.updateCollection) {
                    apolloClient.resetStore()
                }
            } else {
                const variables: any = {
                    input: {
                        title: data.title,
                        description: data.description || null,
                        isPrivate: data.isPrivate,
                        type: data.type,
                        titleItems:
                            titleItems.length > 0 ? titleItems : undefined,
                        locationItems:
                            locationItems.length > 0
                                ? locationItems
                                : undefined,
                    },
                }

                if (coverImageFile) {
                    variables.coverImage = coverImageFile
                }

                await createCollection({ variables })
            }
        } catch (error) {
            console.error('Error with collection:', error)
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (watchType === CollectionType.Title) {
            setLocationsSearchTerm('')
        } else {
            setTitlesSearchTerm('')
        }
    }, [watchType])

    return (
        <div className='space-y-4'>
            <div className='flex flex-col items-start justify-start gap-4 md:flex-row md:items-start md:justify-between'>
                <Heading
                    title={
                        isEditMode
                            ? t('edit.heading', {
                                  title: initialCollection.title,
                              })
                            : t('create.heading')
                    }
                    description={
                        isEditMode
                            ? t('edit.description')
                            : t('create.description')
                    }
                />
                <div className='flex flex-row gap-x-2'>
                    <Button
                        variant='outline'
                        onClick={onCancel || (() => router.back())}
                        disabled={isSubmitting}
                    >
                        <ArrowLeft className='mr-2 size-4' />
                        {t('actions.back')}
                    </Button>

                    {isEditMode && (
                        <Button
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className='mr-2 size-4 animate-spin' />
                            ) : (
                                <Save className='mr-2 size-4' />
                            )}
                            {t('actions.save')}
                        </Button>
                    )}
                </div>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8'
                >
                    <FormField
                        control={form.control}
                        name='type'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('fields.type.label')}</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={isEditMode}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={t(
                                                    'fields.type.placeholder',
                                                )}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem
                                            value={CollectionType.Title}
                                        >
                                            {t('fields.type.title')}
                                        </SelectItem>
                                        <SelectItem
                                            value={CollectionType.Location}
                                        >
                                            {t('fields.type.location')}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    {t('fields.type.description')}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='title'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('fields.title.label')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t(
                                            'fields.title.placeholder',
                                        )}
                                        {...field}
                                        className='bg-background'
                                    />
                                </FormControl>
                                <FormDescription>
                                    {t('fields.title.description')}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t('fields.description.label')}
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={t(
                                            'fields.description.placeholder',
                                        )}
                                        {...field}
                                        value={field.value || ''}
                                        rows={4}
                                    />
                                </FormControl>
                                <FormDescription>
                                    {t('fields.description.description')}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='coverImage'
                        render={() => (
                            <FormItem>
                                <FormLabel>
                                    {t('fields.coverImage.label')}
                                </FormLabel>
                                <div className='space-y-4'>
                                    <input
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        type='file'
                                        accept='image/*'
                                        className='hidden'
                                    />

                                    {coverImagePreview ? (
                                        <div className='relative h-56 w-full overflow-hidden rounded-md'>
                                            <div className='h-full w-full'>
                                                <Image
                                                    src={coverImagePreview}
                                                    alt={t(
                                                        'fields.coverImage.preview',
                                                    )}
                                                    className='object-cover'
                                                    fill
                                                />
                                            </div>
                                            <div className='absolute right-2 top-2 flex gap-2'>
                                                <Button
                                                    variant='outline'
                                                    size='icon'
                                                    onClick={
                                                        handleOpenFileDialog
                                                    }
                                                    type='button'
                                                    className='bg-background/80 backdrop-blur-sm'
                                                >
                                                    <Pencil className='size-4' />
                                                </Button>
                                                <Button
                                                    variant='outline'
                                                    size='icon'
                                                    onClick={handleRemoveImage}
                                                    type='button'
                                                    className='bg-background/80 text-destructive backdrop-blur-sm'
                                                >
                                                    <Trash2 className='size-4' />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={handleOpenFileDialog}
                                            className='flex h-56 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 text-center transition-colors hover:bg-muted/50'
                                        >
                                            <Upload className='mb-2 size-8 text-muted-foreground' />
                                            <p className='mb-1 text-sm font-medium'>
                                                {t('fields.coverImage.label')}
                                            </p>
                                            <p className='text-xs text-muted-foreground'>
                                                {t(
                                                    'fields.coverImage.description',
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='isPrivate'
                        render={({ field }) => (
                            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                                <div className='space-y-0.5'>
                                    <FormLabel>
                                        {t('fields.isPrivate.label')}
                                    </FormLabel>
                                    <FormDescription>
                                        {t('fields.isPrivate.description')}
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className='space-y-6 rounded-lg border p-6'>
                        <Heading
                            title={
                                watchType === CollectionType.Title
                                    ? t('items.title.heading')
                                    : t('items.location.heading')
                            }
                            description={
                                watchType === CollectionType.Title
                                    ? t('items.title.description')
                                    : t('items.location.description')
                            }
                            size='sm'
                        />

                        <div className='space-y-4'>
                            <div>
                                <h3 className='mb-1 text-sm font-medium'>
                                    {t('items.search')}
                                </h3>

                                {watchType === CollectionType.Title ? (
                                    <FormField
                                        control={form.control}
                                        name='titleItems'
                                        render={() => (
                                            <FormItem>
                                                <ResponsiveCombobox
                                                    options={titlesOptions}
                                                    value={selectedTitles.map(
                                                        title => title.id,
                                                    )}
                                                    onChange={
                                                        handleTitlesSelect
                                                    }
                                                    onSearch={handleTitleSearch}
                                                    placeholder={t(
                                                        'items.title.searchPlaceholder',
                                                    )}
                                                    emptyPlaceholder={
                                                        titlesLoading
                                                            ? t('items.loading')
                                                            : t(
                                                                  'items.title.noResults',
                                                              )
                                                    }
                                                    multiple={true}
                                                    searchPlaceholder={t(
                                                        'items.title.searchInputPlaceholder',
                                                    )}
                                                    title={t(
                                                        'items.title.selectTitle',
                                                    )}
                                                    displayValues={false}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name='locationItems'
                                        render={() => (
                                            <FormItem>
                                                <ResponsiveCombobox
                                                    options={locationsOptions}
                                                    value={selectedLocations.map(
                                                        location => location.id,
                                                    )}
                                                    onChange={
                                                        handleLocationsSelect
                                                    }
                                                    onSearch={
                                                        handleLocationSearch
                                                    }
                                                    placeholder={t(
                                                        'items.location.searchPlaceholder',
                                                    )}
                                                    emptyPlaceholder={
                                                        locationsLoading
                                                            ? t('items.loading')
                                                            : t(
                                                                  'items.location.noResults',
                                                              )
                                                    }
                                                    multiple={true}
                                                    searchPlaceholder={t(
                                                        'items.location.searchInputPlaceholder',
                                                    )}
                                                    title={t(
                                                        'items.location.selectTitle',
                                                    )}
                                                    displayValues={false}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            {watchType === CollectionType.Title &&
                                selectedTitles.length > 0 && (
                                    <div>
                                        <h3 className='mb-1 text-sm font-medium'>
                                            {t('items.title.selected', {
                                                count: selectedTitles.length,
                                            })}
                                        </h3>
                                        <DragDropContext
                                            onDragEnd={handleTitleDragEnd}
                                        >
                                            <Droppable
                                                droppableId='titles'
                                                type='title'
                                                direction='horizontal'
                                            >
                                                {provided => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'
                                                    >
                                                        {selectedTitles.map(
                                                            (title, index) => (
                                                                <Draggable
                                                                    key={
                                                                        title.id
                                                                    }
                                                                    draggableId={
                                                                        title.id
                                                                    }
                                                                    index={
                                                                        index
                                                                    }
                                                                >
                                                                    {(
                                                                        provided,
                                                                        snapshot,
                                                                    ) => (
                                                                        <div
                                                                            ref={
                                                                                provided.innerRef
                                                                            }
                                                                            {...provided.draggableProps}
                                                                            className={cn(
                                                                                'relative rounded-lg border transition-shadow',
                                                                                snapshot.isDragging &&
                                                                                    'shadow-xl',
                                                                            )}
                                                                            style={{
                                                                                ...provided
                                                                                    .draggableProps
                                                                                    .style,
                                                                            }}
                                                                        >
                                                                            <div
                                                                                {...provided.dragHandleProps}
                                                                                className='absolute right-2 top-2 z-10 cursor-grab rounded-full bg-background/80 p-1 backdrop-blur-sm active:cursor-grabbing'
                                                                            >
                                                                                <GripVertical className='size-5 text-primary' />
                                                                            </div>
                                                                            <TitleBackdropCard
                                                                                title={
                                                                                    title
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ),
                                                        )}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    </div>
                                )}

                            {watchType === CollectionType.Location &&
                                selectedLocations.length > 0 && (
                                    <div>
                                        <h3 className='mb-1 text-sm font-medium'>
                                            {t('items.location.selected', {
                                                count: selectedLocations.length,
                                            })}
                                        </h3>
                                        <DragDropContext
                                            onDragEnd={handleLocationDragEnd}
                                        >
                                            <Droppable
                                                droppableId='locations'
                                                type='location'
                                            >
                                                {provided => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        className='space-y-4'
                                                    >
                                                        {selectedLocations.map(
                                                            (
                                                                location,
                                                                index,
                                                            ) => (
                                                                <Draggable
                                                                    key={
                                                                        location.id
                                                                    }
                                                                    draggableId={
                                                                        location.id
                                                                    }
                                                                    index={
                                                                        index
                                                                    }
                                                                >
                                                                    {(
                                                                        provided,
                                                                        snapshot,
                                                                    ) => (
                                                                        <div
                                                                            ref={
                                                                                provided.innerRef
                                                                            }
                                                                            {...provided.draggableProps}
                                                                            className={cn(
                                                                                'relative rounded-lg border',
                                                                                snapshot.isDragging &&
                                                                                    'shadow-xl',
                                                                            )}
                                                                            style={{
                                                                                ...provided
                                                                                    .draggableProps
                                                                                    .style,
                                                                            }}
                                                                        >
                                                                            <div
                                                                                {...provided.dragHandleProps}
                                                                                className='absolute right-2 top-1/2 z-10 -translate-y-1/2 cursor-grab rounded-full bg-background/80 p-1 backdrop-blur-sm active:cursor-grabbing'
                                                                            >
                                                                                <GripVertical className='size-5 text-primary' />
                                                                            </div>
                                                                            <div className='p-4'>
                                                                                {location.formattedAddress ||
                                                                                    location.address}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ),
                                                        )}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    </div>
                                )}

                            {((watchType === CollectionType.Title &&
                                selectedTitles.length === 0) ||
                                (watchType === CollectionType.Location &&
                                    selectedLocations.length === 0)) && (
                                <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center'>
                                    <Info className='mb-4 size-10 text-muted-foreground' />
                                    <h3 className='mb-2 text-lg font-semibold'>
                                        {watchType === CollectionType.Title
                                            ? t('items.title.empty.heading')
                                            : t('items.location.empty.heading')}
                                    </h3>
                                    <p className='text-sm text-muted-foreground'>
                                        {watchType === CollectionType.Title
                                            ? t('items.title.empty.description')
                                            : t(
                                                  'items.location.empty.description',
                                              )}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {!isEditMode && (
                        <div className='flex justify-end'>
                            <Button type='submit' disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <Loader2 className='mr-2 size-4 animate-spin' />
                                ) : (
                                    <Save className='mr-2 size-4' />
                                )}
                                {t('actions.create')}
                            </Button>
                        </div>
                    )}
                </form>
            </Form>
        </div>
    )
}
