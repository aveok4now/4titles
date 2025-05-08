'use client'

import {
    FilmingLocationProposalType,
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
import { getLocalizedTitleName } from '@/utils/localization/title-localization'
import { useLocale, useTranslations } from 'next-intl'
import { FilmingLocationProposalForm } from '../forms'

interface AddFilmingLocationDialogProps {
    isOpen: boolean
    onClose: () => void
    title: Title
}

export function AddFilmingLocationDialog({
    isOpen,
    onClose,
    title,
}: AddFilmingLocationDialogProps) {
    const t = useTranslations('titleDetails.filmingLocations.addDialog')
    const locale = useLocale()

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
                            {t('description', {
                                type: title.type,
                                title: getLocalizedTitleName(title, locale),
                            })}
                        </DialogDescription>
                    </DialogHeader>

                    <FilmingLocationProposalForm
                        type={FilmingLocationProposalType.Add}
                        titleId={title.id}
                        onSuccess={onClose}
                    />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
