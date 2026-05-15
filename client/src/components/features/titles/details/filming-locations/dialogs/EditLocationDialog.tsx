'use client'

import {
    FilmingLocationProposalType,
    type FilmingLocation,
    type Title,
} from '@/graphql/generated/output'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/common/dialog'
import { ScrollArea } from '@/components/ui/common/scroll-area'
import { useTranslations } from 'next-intl'
import { FilmingLocationProposalForm } from '../forms'

interface EditLocationDialogProps {
    isOpen: boolean
    onClose: () => void
    location: NonNullable<FilmingLocation>
    title?: Title
}

export function EditLocationDialog({
    isOpen,
    onClose,
    location,
    title,
}: EditLocationDialogProps) {
    const t = useTranslations('titleDetails.filmingLocations.editDialog')

    if (!title) return null

    return (
        <Dialog
            open={isOpen}
            onOpenChange={isOpen => {
                if (!isOpen) onClose()
            }}
        >
            <DialogContent className='max-h-[30rem] max-w-md sm:max-h-full lg:max-w-2xl'>
                <ScrollArea className='h-[28rem] lg:h-full'>
                    <DialogHeader>
                        <DialogTitle>{t('heading')}</DialogTitle>
                        <DialogDescription>
                            {t('description')}
                        </DialogDescription>
                    </DialogHeader>

                    <FilmingLocationProposalForm
                        type={FilmingLocationProposalType.Edit}
                        titleId={title.id}
                        location={location}
                        onSuccess={onClose}
                    />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
