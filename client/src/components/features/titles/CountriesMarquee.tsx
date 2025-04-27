'use client'

import { AvatarFallback } from '@/components/ui/common/avatar'
import { Marquee } from '@/components/ui/custom/content/marquee'
import { Hint } from '@/components/ui/elements/Hint'
import { Country, CountryStatistics } from '@/graphql/generated/output'
import { getLocalizedCountryName } from '@/utils/localization/country-localization'
import { cn } from '@/utils/tw-merge'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface CountriesMarqueeProps {
    countries: CountryStatistics[]
}

const CountryCard = ({ country }: { country: CountryStatistics }) => {
    const t = useTranslations('countries')
    const locale = useLocale()
    const router = useRouter()

    const displayName = getLocalizedCountryName(country as Country, locale)

    const formatStats = () => {
        return t('statistics', {
            moviesCount: country.moviesCount,
            seriesCount: country.seriesCount,
            locationsCount: country.locationsCount,
        })
    }

    return (
        <Hint label={t('goToCountry')} side='bottom' align='center'>
            <figure
                onClick={() =>
                    router.push(`/titles?country=${country.iso.toLowerCase()}`)
                }
                className={cn(
                    'relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4',
                    'border-border/[.1] bg-primary/[.01] hover:bg-primary/[.05]',
                    'dark:border-border/[.1] dark:bg-primary/[.10] dark:hover:bg-primary/[.15]',
                )}
            >
                <div className='flex flex-row items-center gap-2'>
                    {country.flagUrl ? (
                        <Image
                            width={36}
                            height={36}
                            alt={country.iso}
                            src={country.flagUrl}
                            className='rounded'
                        />
                    ) : (
                        <AvatarFallback className='size-9 rounded'>
                            {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    )}
                    <div className='flex flex-col'>
                        <figcaption className='text-sm font-medium dark:text-white'>
                            {displayName}
                        </figcaption>
                        <p className='text-xs font-medium dark:text-white/40'>
                            {country.iso}
                        </p>
                    </div>
                </div>
                <blockquote className='mt-2 text-sm'>
                    {formatStats()}
                </blockquote>
            </figure>
        </Hint>
    )
}

export function CountriesMarquee({ countries }: CountriesMarqueeProps) {
    const halfLength = Math.ceil(countries.length / 2)
    const firstRow = countries.slice(0, halfLength)
    const secondRow = countries.slice(halfLength)

    return (
        <div className='relative flex w-full flex-col items-center justify-center overflow-hidden'>
            <Marquee pauseOnHover className='[--duration:45s]'>
                {firstRow.map(country => (
                    <CountryCard key={country.id} country={country} />
                ))}
            </Marquee>
            <Marquee reverse pauseOnHover className='[--duration:45s]'>
                {secondRow.map(country => (
                    <CountryCard key={country.id} country={country} />
                ))}
            </Marquee>
            <div className='pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background'></div>
            <div className='pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background'></div>
        </div>
    )
}
