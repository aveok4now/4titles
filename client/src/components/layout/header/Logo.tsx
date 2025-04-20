'use client'

import { AuroraText } from '@/components/ui/custom/text/aurora-text'
import ShinyText from '@/components/ui/custom/text/shiny-text'
import { SITE_NAME } from '@/libs/constants/seo.constants'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

export function Logo() {
    const t = useTranslations('layout.header.logo')

    return (
        <Link
            href='/'
            className='flex items-center gap-x-4 transition-opacity duration-500 hover:opacity-70'
        >
            <Image
                src={'/images/logo.svg'}
                alt={SITE_NAME}
                width={40}
                height={40}
            />
            <div className='hidden flex-col leading-tight md:flex'>
                <AuroraText className='text-lg font-bold tracking-wider'>
                    {SITE_NAME}
                </AuroraText>
                <ShinyText
                    text={t('description')}
                    className='text-sm text-foreground/80'
                />
            </div>
        </Link>
    )
}
