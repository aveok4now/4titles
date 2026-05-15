'use client'

import type { FindProfileByUsernameQuery } from '@/graphql/generated/output'

import { CardContent, CardHeader, CardTitle } from '@/components/ui/common/card'
import FadeContent from '@/components/ui/custom/content/fade-content'
import ShinyText from '@/components/ui/custom/text/shiny-text'
import { useTranslations } from 'next-intl'

interface ProfileBioSectionProps {
    profile: FindProfileByUsernameQuery['findProfileByUsername']
}

export function ProfileBioSection({ profile }: ProfileBioSectionProps) {
    const t = useTranslations('profile.bio')

    return (
        <FadeContent blur delay={1300}>
            <CardHeader>
                <CardTitle>
                    <ShinyText
                        text={t('heading')}
                        className='text-foreground/85'
                    />
                </CardTitle>
            </CardHeader>
            <CardContent>
                {profile.bio ? (
                    <p className='whitespace-pre-wrap'>{profile.bio}</p>
                ) : (
                    <p className='text-center text-muted-foreground'>
                        {t('noBio')}
                    </p>
                )}
            </CardContent>
        </FadeContent>
    )
}
