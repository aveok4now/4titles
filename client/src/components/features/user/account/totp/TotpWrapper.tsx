'use client'

import { Skeleton } from '@/components/ui/common/skeleton'
import { CardContainer } from '@/components/ui/elements/CardContainer'
import { useCurrent } from '@/hooks/useCurrent'
import { useTranslations } from 'next-intl'
import { DisableTotp } from './DisableTotp'
import { EnableTotp } from './EnableTotp'

export function TotpWrapper() {
    const t = useTranslations('dashboard.settings.account.twoFactor')

    const { profile, isLoadingProfile } = useCurrent()

    return isLoadingProfile ? (
        <TotpWrapperSkeleton />
    ) : (
        <CardContainer
            heading={t('heading')}
            description={t('description')}
            rightContent={
                <div className='flex items-center gap-x-4'>
                    {!profile?.isTotpEnabled ? <EnableTotp /> : <DisableTotp />}
                </div>
            }
        />
    )
}

export function TotpWrapperSkeleton() {
    return <Skeleton className='h-24 w-full' />
}
