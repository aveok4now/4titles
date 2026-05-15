import {
    Title,
    TitleCountry,
    TitleExternalIds,
    TitleGenre,
} from '@/graphql/generated/output'

export interface TitleBasicInfo {
    id: string
    slug: string | undefined | null
    name: string
    posterUrl: string
    backdropUrl: string
    releaseYear: number | undefined
    productionCountry: {
        iso: string
        name: string | undefined | null
    } | null
}

export interface TitleDetailedInfo extends TitleBasicInfo {
    overview: string
    tagline: string
    backdropUrl: string
    runtime: number | null
    releaseDate: Date | null
    voteAverage: number
    popularity: number
    genres: TitleGenre[]
    countries: TitleCountry[]
    externalIds: TitleExternalIds
    hasLocations: boolean
    logoUrl: string
    originalTitle: Partial<Title>
}
