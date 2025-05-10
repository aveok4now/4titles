import { Country } from '@/graphql/generated/output'
import { DEFAULT_LANGUAGE } from '@/libs/i18n/config'

export function getLocalizedCountryName(
    country: Country,
    locale: string,
): string {
    return locale === DEFAULT_LANGUAGE && country.name
        ? country.name
        : country.englishName
}
