'use client'

import { Card } from '@/components/ui/common/card'
import { Hint } from '@/components/ui/elements/Hint'
import { TitleProductionCompany } from '@/graphql/generated/output'
import Image from 'next/image'

interface TitleProductionCompaniesItemProps {
    company: TitleProductionCompany
    priority?: boolean
}

export function TitleProductionCompaniesItem({
    company,
    priority = false,
}: TitleProductionCompaniesItemProps) {
    const logoUrl = company.logo_path
        ? `https://image.tmdb.org/t/p/w154${company.logo_path}`
        : null

    return logoUrl ? (
        <Card className='relative flex h-32 w-32 items-center justify-center bg-background p-2 dark:bg-foreground'>
            <Hint label={company.name!} side='bottom' align='center'>
                <div className='relative flex h-full w-full items-center justify-center overflow-hidden'>
                    <Image
                        src={logoUrl}
                        alt={company.name || 'Production company'}
                        className='max-h-full max-w-full object-contain'
                        width={100}
                        height={100}
                        priority={priority}
                    />
                </div>
            </Hint>
        </Card>
    ) : (
        <div className='flex h-32 w-32 items-center justify-center rounded-md border border-border bg-card p-2'>
            <span className='text-center text-sm text-muted-foreground'>
                {company.name}
            </span>
        </div>
    )
}
