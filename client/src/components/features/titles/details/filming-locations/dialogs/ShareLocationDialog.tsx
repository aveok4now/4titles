'use client'

import { Button } from '@/components/ui/common/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/common/dialog'
import { Input } from '@/components/ui/common/input'
import { Separator } from '@/components/ui/common/separator'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/common/tabs'
import { FilmingLocation, Title } from '@/graphql/generated/output'
import {
    getLocalizedTitleData,
    getLocalizedTitleName,
    getTitlePosterUrl,
} from '@/utils/title/title-localization'
import { Copy, Link as LinkIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    LineIcon,
    LineShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    MailruIcon,
    MailruShareButton,
    OKIcon,
    OKShareButton,
    PinterestIcon,
    PinterestShareButton,
    RedditIcon,
    RedditShareButton,
    TelegramIcon,
    TelegramShareButton,
    TumblrIcon,
    TumblrShareButton,
    TwitterShareButton,
    VKIcon,
    VKShareButton,
    ViberIcon,
    ViberShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    XIcon,
} from 'react-share'

interface ShareLocationDialogProps {
    isOpen: boolean
    onClose: () => void
    location: NonNullable<FilmingLocation>
    title: Title
    locale: string
}

export function ShareLocationDialog({
    isOpen,
    onClose,
    location,
    title,
    locale,
}: ShareLocationDialogProps) {
    const t = useTranslations('titleDetails.filmingLocations.shareDialog')
    const tTitleDetails = useTranslations('titleDetails')

    const [activeTab, setActiveTab] = useState<string>('social')
    const titleName = getLocalizedTitleName(title, locale)
    const { overview } = getLocalizedTitleData(title, locale)
    const locationAddress = location.address
    const coordinates = location.coordinates
        ? `${location.coordinates.x},${location.coordinates.y}`
        : ''

    const shareUrl =
        typeof window !== 'undefined'
            ? `${window.location.origin}/titles/${title.slug}?location=${location.id}`
            : ''
    const shareTitle = t('shareTitle', {
        title: titleName,
        type: title.type,
        location: locationAddress,
    })
    const shareDescription = t('shareDescription', {
        title: titleName,
        type: title.type,
        location: locationAddress,
    })
    const mediaThumbnail = getTitlePosterUrl(title, locale)

    const iconSize = 40

    const shareButtons: {
        Button: React.ComponentType<any>
        Icon: React.ComponentType<any>
        props: Record<string, any>
    }[] = useMemo(
        () => [
            {
                Button: FacebookShareButton,
                Icon: FacebookIcon,
                props: {
                    url: shareUrl,
                    hashtag: `#${titleName.replace(/\s+/g, '')}`,
                },
            },
            {
                Button: TwitterShareButton,
                Icon: XIcon,
                props: { url: shareUrl, title: shareDescription },
            },
            {
                Button: TelegramShareButton,
                Icon: TelegramIcon,
                props: {
                    url: shareUrl,
                    title: shareDescription,
                },
            },
            {
                Button: WhatsappShareButton,
                Icon: WhatsappIcon,
                props: { url: shareUrl, title: shareDescription },
            },
            {
                Button: LinkedinShareButton,
                Icon: LinkedinIcon,
                props: {
                    url: shareUrl,
                    title: shareTitle,
                    summary: shareDescription,
                    source: shareUrl,
                },
            },
            {
                Button: PinterestShareButton,
                Icon: PinterestIcon,
                props: {
                    url: shareUrl,
                    media: mediaThumbnail,
                    description: shareDescription,
                },
            },
            {
                Button: ViberShareButton,
                Icon: ViberIcon,
                props: { url: shareUrl, title: shareDescription },
            },
            {
                Button: LineShareButton,
                Icon: LineIcon,
                props: { url: shareUrl, title: shareDescription },
            },
            {
                Button: MailruShareButton,
                Icon: MailruIcon,
                props: {
                    url: shareUrl,
                    title: shareTitle,
                    description: shareDescription,
                },
            },
            {
                Button: OKShareButton,
                Icon: OKIcon,
                props: {
                    url: shareUrl,
                    title: shareTitle,
                    description: shareDescription,
                },
            },
            {
                Button: RedditShareButton,
                Icon: RedditIcon,
                props: { url: shareUrl, title: shareDescription },
            },
            {
                Button: TumblrShareButton,
                Icon: TumblrIcon,
                props: {
                    url: shareUrl,
                    title: shareTitle,
                    description: shareDescription,
                },
            },
            {
                Button: VKShareButton,
                Icon: VKIcon,
                props: { url: shareUrl, title: shareTitle },
            },
            {
                Button: EmailShareButton,
                Icon: EmailIcon,
                props: {
                    url: shareUrl,
                    subject: shareTitle,
                    body: shareDescription,
                },
            },
        ],
        [shareUrl, shareTitle, shareDescription, titleName, mediaThumbnail],
    )

    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(shareUrl)
        toast.success(t('linkCopied'))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>{t('heading')}</DialogTitle>
                </DialogHeader>

                <div className='mt-2'>
                    <div className='mb-4 flex items-center space-x-2'>
                        <div className='relative flex-1'>
                            <Input
                                value={shareUrl}
                                readOnly
                                className='pr-10'
                            />
                            <Button
                                variant='ghost'
                                size='icon'
                                className='absolute right-0 top-0 h-full'
                                onClick={handleCopyLink}
                            >
                                <Copy className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>

                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className='w-full'
                    >
                        <TabsList className='mb-4 grid w-full grid-cols-2'>
                            <TabsTrigger value='social'>
                                {t('social')}
                            </TabsTrigger>
                            <TabsTrigger value='details'>
                                {t('details')}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value='social' className='space-y-4'>
                            <div className='flex flex-wrap items-center justify-center gap-4'>
                                {shareButtons.map(
                                    (
                                        {
                                            Button: Btn,
                                            Icon: IconComponent,
                                            props,
                                        },
                                        idx,
                                    ) => (
                                        <Btn
                                            key={idx}
                                            {...props}
                                            className='transition-transform hover:scale-110'
                                        >
                                            <IconComponent
                                                size={iconSize}
                                                round
                                            />
                                        </Btn>
                                    ),
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value='details' className='space-y-3'>
                            <div className='space-y-2'>
                                <h3 className='text-sm font-medium'>
                                    {tTitleDetails('hero.overview')}
                                </h3>
                                <p className='text-sm text-muted-foreground'>
                                    {overview}
                                </p>
                            </div>

                            <Separator />

                            <div className='space-y-2'>
                                <h3 className='text-sm font-medium'>
                                    {t('locationInfo')}
                                </h3>
                                <p className='text-sm text-muted-foreground'>
                                    {location.address}
                                </p>
                                {location.description && (
                                    <p className='text-sm text-muted-foreground'>
                                        {location.description}
                                    </p>
                                )}
                                {coordinates && (
                                    <div className='flex items-center gap-2'>
                                        <LinkIcon className='h-3 w-3 text-muted-foreground' />
                                        <span className='text-xs text-muted-foreground'>
                                            {coordinates}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter className='mt-4 flex w-full items-center justify-between'>
                    <Button variant='outline' onClick={onClose}>
                        {t('closeButton')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
