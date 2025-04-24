import { FindSessionsByUserQuery } from '@/graphql/generated/output'
import { DEFAULT_LANGUAGE } from '@/libs/i18n/config'

type SessionData = FindSessionsByUserQuery['findSessionsByUser'][0]

export function getSessionDisplayData(session: SessionData, locale: string) {
    const countryName =
        locale === DEFAULT_LANGUAGE
            ? session.metadata.location.country[DEFAULT_LANGUAGE]
            : session.metadata.location.country.en

    return {
        deviceInfo: `${session.metadata.device.browser}, ${session.metadata.device.os}`,
        locationInfo: `${countryName}, ${session.metadata.location.city}`,
        location: [
            session.metadata.location.longitude,
            session.metadata.location.latidute,
        ] as [number, number],
    }
}
