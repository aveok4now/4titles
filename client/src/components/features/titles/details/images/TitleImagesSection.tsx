'use client'

import { TitleImage } from '@/graphql/generated/output'
import { useTranslations } from 'next-intl'
import { TitleSectionContainer } from '../TitleSectionContainer'
import { TitleImagesGallery } from './TitleImagesGallery'

interface TitleImagesSectionProps {
    backdrops: TitleImage[]
    posters: TitleImage[]
    logos: TitleImage[]
    locale: string
}

export function TitleImagesSection({
    backdrops,
    posters,
    logos,
    locale,
}: TitleImagesSectionProps) {
    const t = useTranslations('titleDetails.images')

    if (backdrops.length === 0 && posters.length === 0 && logos.length === 0)
        return null

    return (
        <TitleSectionContainer delay={150} title={t('heading')}>
            <TitleImagesGallery
                backdrops={backdrops}
                posters={posters}
                logos={logos}
                locale={locale}
            />
        </TitleSectionContainer>
    )
}
