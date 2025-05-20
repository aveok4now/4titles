'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/common/card'
import FadeContent from '@/components/ui/custom/content/fade-content'
import { AccentSpotlight } from '@/components/ui/elements/AccentSpotlight'
import { type FindProfileByUsernameQuery } from '@/graphql/generated/output'
import { ProfileActivitySection } from './sections/activity'
import { ProfileBioSection } from './sections/bio'
import { ProfileInfoSection } from './sections/info'
import { ProfileSocialsSection } from './sections/socials'
import { ProfileStatisticsSection } from './sections/statistics'

interface ProfileViewProps {
    profile: FindProfileByUsernameQuery['findProfileByUsername']
}

export function ProfileView({ profile }: ProfileViewProps) {
    return (
        <div className='mx-auto mt-4 w-full max-w-7xl'>
            <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'>
                <Card className='bg-background/60 md:col-span-2 lg:col-span-2'>
                    <CardHeader className='flex flex-col items-start gap-4 sm:flex-row'>
                        <FadeContent delay={500}>
                            <ProfileInfoSection profile={profile} />
                        </FadeContent>
                    </CardHeader>

                    <CardContent>
                        <FadeContent delay={600}>
                            <ProfileSocialsSection profile={profile} />
                        </FadeContent>
                        <FadeContent delay={700}>
                            <ProfileStatisticsSection profile={profile} />
                        </FadeContent>
                    </CardContent>
                </Card>

                <Card className='bg-background/60 md:col-span-1 lg:col-span-2'>
                    <FadeContent delay={800}>
                        <ProfileActivitySection profile={profile} />
                    </FadeContent>
                </Card>

                <Card className='bg-background/60 md:col-span-2 lg:col-span-4'>
                    <FadeContent delay={900}>
                        <ProfileBioSection profile={profile} />
                    </FadeContent>
                </Card>
            </div>

            <AccentSpotlight />
        </div>
    )
}
