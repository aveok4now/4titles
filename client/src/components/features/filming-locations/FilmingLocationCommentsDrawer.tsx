'use client'

import { CommentsSection } from '@/components/features/comments/CommentsSection'
import { Button } from '@/components/ui/common/button'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/common/drawer'
import {
    CommentableType,
    type FilmingLocation,
    type Title,
} from '@/graphql/generated/output'
import { DEFAULT_LANGUAGE } from '@/libs/i18n/config'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface FilmingLocationCommentsDrawerProps {
    isOpen: boolean
    onClose: () => void
    location: FilmingLocation
    title: Title
    locale?: string
}

export function FilmingLocationCommentsDrawer({
    isOpen,
    onClose,
    location,
    title,
    locale = DEFAULT_LANGUAGE,
}: FilmingLocationCommentsDrawerProps) {
    const t = useTranslations('titleDetails.filmingLocations.comments')

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className='h-[85vh] overflow-hidden'>
                <DrawerHeader className='relative flex items-center justify-center border-b pb-2'>
                    <DrawerTitle className='text-center'>
                        {t('heading', {
                            location:
                                location.formattedAddress || location.address,
                        })}
                    </DrawerTitle>
                    <DrawerClose
                        asChild
                        className='absolute right-4 top-1/2 -translate-y-1/2'
                    >
                        <Button variant='ghost' size='icon'>
                            <X className='size-4' />
                        </Button>
                    </DrawerClose>
                </DrawerHeader>
                <div className='h-full overflow-y-auto p-4'>
                    <CommentsSection
                        commentableId={location.id}
                        commentableType={CommentableType.Location}
                        locale={locale}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    )
}
