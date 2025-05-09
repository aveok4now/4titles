'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/common/accordion'
import ShinyText from '@/components/ui/custom/text/shiny-text'
import { Heading } from '@/components/ui/elements/Heading'
import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

export function FaqList() {
    const t = useTranslations('faq')

    const faqKeys = useMemo(
        () => [
            'whatIs4Titles',
            'howToUse',
            'howToAddLocation',
            'canEditLocations',
            'howToTrackProposals',
            'canSaveToFavorites',
            'howToGetNotifications',
            'canShareLocation',
            'whatIfFoundError',
            'dataProtection',
            'whatIsFilmTourism',
            'plansForRoutes',
            'howOftenUpdated',
            'canUseInfoCommercially',
            'isMobileAppAvailable',
            'howToChangeTheme',
            'availableLanguages',
            'howToChangePassword',
            'howToRestorePassword',
            'howTo2FA',
            'howToDeactivateAccount',
            'howToManageSessions',
            'howToAddSocialLinks',
            'howToUpdateAvatar',
        ],
        [],
    )

    return (
        <>
            <Heading
                title={t('heading')}
                description={t('description')}
                size='lg'
            />

            <div className='mt-4'>
                <Accordion
                    className='flex w-full flex-col'
                    variants={{
                        expanded: {
                            opacity: 1,
                            scale: 1,
                        },
                        collapsed: {
                            opacity: 0,
                            scale: 0.7,
                        },
                    }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                >
                    {faqKeys.map(key => (
                        <AccordionItem key={key} value={key} className='py-2'>
                            <AccordionTrigger className='w-full py-0.5 text-left text-foreground'>
                                <div className='flex items-center'>
                                    <ChevronRight className='size-4 transition-transform duration-200 group-aria-expanded:rotate-90' />
                                    <ShinyText
                                        className='ml-2 text-foreground/95'
                                        text={t(`questions.${key}.question`)}
                                    />
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className='origin-left'>
                                <p className='pl-6 pr-2 text-muted-foreground'>
                                    {t(`questions.${key}.answer`)}
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </>
    )
}
