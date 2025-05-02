'use client'

import { Marquee } from '@/components/ui/custom/content/marquee'
import { Heading } from '@/components/ui/elements/Heading'
import { Title } from '@/graphql/generated/output'
import { useTranslations } from 'next-intl'
import { TitleProductionCompaniesItem } from './TitleProductionCompaniesItem'

interface TitleProductionCompaniesProps {
    productionCompanies: NonNullable<Title['productionCompanies']>
}

export function TitleProductionCompaniesSection({
    productionCompanies,
}: TitleProductionCompaniesProps) {
    const t = useTranslations('titleDetails')

    if (!productionCompanies?.length) return null

    const SectionContainer: React.FC<{ children: React.ReactNode }> = ({
        children,
    }) => (
        <div className='container'>
            <Heading title={t('productionCompanies')} />
            <div className='mt-6'>{children}</div>
        </div>
    )

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
            <SectionContainer>
                <div className='flex flex-wrap justify-center gap-6 sm:justify-start'>
                    {renderCompanies(productionCompanies)}
                </div>
            </SectionContainer>
        )
    }

    return (
        <SectionContainer>
            <div className='relative flex w-full flex-col items-center justify-center overflow-hidden'>
                <Marquee pauseOnHover className='[--duration:20s]'>
                    {renderCompanies(productionCompanies)}
                </Marquee>
                <div className='pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background'></div>
                <div className='pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background'></div>
            </div>
        </SectionContainer>
    )
}
