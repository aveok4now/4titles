import { AvatarFallback } from '@/components/ui/common/avatar'
import { Hint } from '@/components/ui/elements/Hint'
import { Country, CountryStatistics } from '@/graphql/generated/output'
import { getLocalizedCountryName } from '@/utils/country/country-localization'
import { cn } from '@/utils/tw-merge'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function CountryCard({ country }: { country: CountryStatistics }) {
    const t = useTranslations('countries')
    const locale = useLocale()
    const router = useRouter()

    const displayName = getLocalizedCountryName(country as Country, locale)

    const formatStats = () => {
        const { moviesCount, seriesCount, locationsCount } = country

        const parts = []

        if (moviesCount > 0) {
            parts.push(t('statistics.movies', { count: moviesCount }))
        }

        if (seriesCount > 0) {
            parts.push(t('statistics.series', { count: seriesCount }))
        }

        if (locationsCount > 0) {
            parts.push(t('statistics.locations', { count: locationsCount }))
        }

        if (parts.length === 0) {
            return t('statistics.noData')
        }

        if (parts.length === 1) {
            return parts[0]
        } else if (parts.length === 2) {
            return `${parts[0]} ${t('statistics.and')} ${parts[1]}`
        } else {
            const lastPart = parts.pop()
            return `${parts.join(', ')} ${t('statistics.and')} ${lastPart}`
        }
    }

    return (
        <Hint label={t('goToCountry')} side='bottom' align='center'>
            <figure
                onClick={() => router.push(`/titles?countries=${country.iso}`)}
                className={cn(
                    'relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4',
                    'border-border/[50] bg-primary/[.01] hover:bg-primary/[.05]',
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
