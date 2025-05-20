'use client'

import type { FindProfileByUsernameQuery } from '@/graphql/generated/output'

import { Separator } from '@/components/ui/common/separator'
import FadeContent from '@/components/ui/custom/content/fade-content'
import ShinyText from '@/components/ui/custom/text/shiny-text'
import GlassIcons from '@/components/ui/elements/GlassIcons'
import { getSocialColor, getSocialIcon } from '@/utils/get-social-icon'
import { useTranslations } from 'next-intl'

interface ProfileSocialsSectionProps {
    profile: FindProfileByUsernameQuery['findProfileByUsername']
}

export function ProfileSocialsSection({ profile }: ProfileSocialsSectionProps) {
    const t = useTranslations('profile.socials')

    const socialItems =
        profile.socialLinks
            ?.sort((a, b) => a.position - b.position)
            .map(link => {
                const Icon = getSocialIcon(link.url)
                return {
                    icon: <Icon className='size-4 text-foreground' />,
                    color: getSocialColor(link.url),
                    label: link.title,
                    customClass: 'cursor-pointer',
                    url: link.url,
                }
            }) || []

    if (socialItems.length === 0) {
        return null
    }

    return (
        <FadeContent blur delay={600}>
            <div className='flex items-center justify-between'>
                <ShinyText
                    text={t('heading')}
                    className='mb-2 text-lg font-medium text-foreground/85'
                />
                <Separator className='mx-4 h-px flex-1 bg-border/50' />
            </div>
            <div className='-mx-6 overflow-x-auto px-6'>
                <GlassIcons
                    items={socialItems}
                    className='xs:grid-cols-3 grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4 lg:grid-cols-5'
                />
            </div>
        </FadeContent>
    )
}
