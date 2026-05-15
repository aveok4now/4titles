'use client'

import { Marquee } from '@/components/ui/custom/content/marquee'
import { Title } from '@/graphql/generated/output'
import { useTranslations } from 'next-intl'
import { TitleSectionContainer } from '../TitleSectionContainer'
import { TitleProductionCompaniesItem } from './TitleProductionCompaniesItem'

interface TitleProductionCompaniesProps {
    productionCompanies: NonNullable<Title['productionCompanies']>
}

export function TitleProductionCompaniesSection({
    productionCompanies,
}: TitleProductionCompaniesProps) {
    const t = useTranslations('titleDetails.productionCompanies')

    if (!productionCompanies?.length) return null

    const renderCompanies = (companies: typeof productionCompanies) =>
        companies.map((company, index) => (
            <TitleProductionCompaniesItem
                key={`company-${company.id}-${index}`}
                company={company}
                priority={index < 5}
            />
        ))

    if (productionCompanies.length <= 5) {
        return (
            <TitleSectionContainer delay={250} title={t('heading')}>
                <div className='flex flex-wrap justify-start gap-6'>
                    {renderCompanies(productionCompanies)}
                </div>
            </TitleSectionContainer>
        )
    }

    return (
        <TitleSectionContainer delay={250} title={t('heading')}>
            <div className='relative flex w-full flex-col items-center justify-center overflow-hidden'>
                <Marquee pauseOnHover className='[--duration:20s]'>
                    {renderCompanies(productionCompanies)}
                </Marquee>
                <div className='pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background'></div>
                <div className='pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background'></div>
            </div>
        </TitleSectionContainer>
    )
}
