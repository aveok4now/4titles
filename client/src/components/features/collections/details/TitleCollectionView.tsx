'use client'

import { Heading } from '@/components/ui/elements/Heading'
import {
    CollectionType,
    Title,
    TitleCollectionItem,
    useReorderCollectionItemsMutation,
} from '@/graphql/generated/output'
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from '@hello-pangea/dnd'
import { GripVertical } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'
import { TitleBackdropCard } from '../../titles/TitleBackdropCard'

interface TitleCollectionViewProps {
    titles: TitleCollectionItem[]
    isEditable: boolean
    collectionId: string
}

export function TitleCollectionView({
    titles,
    isEditable,
    collectionId,
}: TitleCollectionViewProps) {
    const t = useTranslations('collections.details')
    const [items, setItems] = useState(titles)
    const [isReordering, setIsReordering] = useState(false)

    const [reorderItems] = useReorderCollectionItemsMutation({
        onCompleted: () => {
            toast.success(t('messages.reorderSuccess'))
            setIsReordering(false)
        },
        onError: () => {
            toast.error(t('messages.reorderError'))
            setIsReordering(false)
        },
    })

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const newItems = Array.from(items)
        const [reorderedItem] = newItems.splice(result.source.index, 1)
        newItems.splice(result.destination.index, 0, reorderedItem)

        const reorderData = newItems.map((item, index) => ({
            id: item.id,
            position: index,
            type: CollectionType.Title,
        }))

        setItems(newItems)
        setIsReordering(true)

        reorderItems({
            variables: {
                list: reorderData,
            },
        })
    }

    if (!titles.length) return null

    return (
        <div className='space-y-4'>
            <Heading title={t('titleCollection.heading')} />

            {isEditable ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId='titles' direction='horizontal'>
                        {provided => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                            >
                                {items.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}
                                        isDragDisabled={isReordering}
                                    >
                                        {provided => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className='relative rounded-lg border'
                                            >
                                                <div
                                                    {...provided.dragHandleProps}
                                                    className='absolute right-2 top-2 z-10 rounded-full bg-background/80 p-1 backdrop-blur-sm'
                                                >
                                                    <GripVertical className='h-5 w-5 text-primary' />
                                                </div>
                                                <TitleBackdropCard
                                                    title={item.title as Title}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            ) : (
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                    {titles.map(item => (
                        <TitleBackdropCard
                            key={item.id}
                            title={item.title as Title}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
