import { FilmingLocation } from '@/graphql/generated/output'

export function getLocalizedFilmingLocationDescription(
    location: FilmingLocation,
    locale: string,
): string | null {
    if (!location) return null

    if (location.descriptions && Array.isArray(location.descriptions)) {
        const localizedDescription = location.descriptions.find(
            desc => desc.language?.iso === locale,
        )

        if (localizedDescription?.description) {
            return localizedDescription.description
        }

        if (locale !== 'en') {
            const englishDescription = location.descriptions.find(
                desc => desc.language?.iso === 'en',
            )

            if (englishDescription?.description) {
                return englishDescription.description
            }
        }

        if (
            location.descriptions.length > 0 &&
            location.descriptions[0].description
        ) {
            return location.descriptions[0].description
        }
    }

    return location.description || null
}
