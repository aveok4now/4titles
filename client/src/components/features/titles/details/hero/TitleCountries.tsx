'use client'

import { Hint } from '@/components/ui/elements/Hint'
import { TitleCountry } from '@/graphql/generated/output'
import { getLocalizedCountryName } from '@/utils/country/country-localization'
import Image from 'next/image'

interface TitleCountriesProps {
    countries: TitleCountry[]
    locale: string
    t: (key: string) => string
}

export function TitleCountries({ countries, locale, t }: TitleCountriesProps) {
    return (
        <div className='flex flex-wrap items-center gap-2'>
            {countries.map((countryObj, index) => (
                <Hint
                    key={`${countryObj.country?.iso}-${index}`}
                    label={t('productionCountry')}
                    side='bottom'
                >
                    <div className='flex items-center gap-1.5 rounded-md border border-border px-2 py-1'>
                        {countryObj.country?.flagUrl && (
                            <Image
                                src={countryObj.country.flagUrl}
                                alt={countryObj.country.iso || ''}
                                width={20}
                                height={20}
                                className='rounded-sm'
                            />
                        )}
                        <span className='text-xs text-foreground/80'>
                            {getLocalizedCountryName(
                                countryObj.country,
                                locale,
                            )}
                        </span>
                    </div>
                </Hint>
            ))}
        </div>
    )
}
