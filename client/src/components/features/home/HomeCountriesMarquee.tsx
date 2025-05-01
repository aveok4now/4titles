'use client'

import { Marquee } from '@/components/ui/custom/content/marquee'
import { CountryStatistics } from '@/graphql/generated/output'
import { CountryCard } from '../countries/CountryCard'

interface HomeCountriesMarqueeProps {
    countries: CountryStatistics[]
}

export function HomeCountriesMarquee({ countries }: HomeCountriesMarqueeProps) {
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
