'use client'

import {
    FilmingLocationsContent,
    type ProcessedFilmingLocation,
} from '@/components/features/filming-locations/FilmingLocationsContent'
import FadeContent from '@/components/ui/custom/content/fade-content'
import { Heading } from '@/components/ui/elements/Heading'
import {
    FavoriteType,
    FilmingLocation,
    Title,
    useFindUserFavoritesQuery,
} from '@/graphql/generated/output'
import { getLocalizedFilmingLocationDescription } from '@/utils/filming-location/filming-location-localization'
import { MapStyle } from '@maptiler/sdk'
import { useLocale, useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'
import { useLocationSelection } from '../filming-locations/hooks'

export function FavoriteLocationsSection() {
    const t = useTranslations('favorites.locations')
    const commonT = useTranslations('titleDetails.filmingLocations')
    const locale = useLocale()

    const { data: favoritesData, loading: isLoadingFavorites } =
        useFindUserFavoritesQuery({
            variables: {
                filters: {
                    type: FavoriteType.Location,
                },
            },
            fetchPolicy: 'cache-and-network',
        })

    const resolveLocationDescription = useCallback(
        (location: FilmingLocation) => {
            return locale
                ? getLocalizedFilmingLocationDescription(location, locale) ||
                      location.description ||
                      ''
                : location.description || ''
        },
        [locale],
    )

    const processedFavoriteLocations: ProcessedFilmingLocation[] =
        useMemo(() => {
            if (!favoritesData?.findMyFavorites) return []
            return favoritesData.findMyFavorites
                .filter(
                    fav =>
                        fav.type === FavoriteType.Location &&
                        fav.filmingLocation &&
                        fav.filmingLocationTitle,
                )
                .map(fav => {
                    if (!fav.filmingLocation) return null
                    const resolvedDescription = resolveLocationDescription(
                        fav.filmingLocation as FilmingLocation,
                    )
                    return {
                        originalItem: fav,
                        processedFilmingLocation: {
                            ...fav.filmingLocation,
                            description: resolvedDescription,
                        },
                        titleForListItem: fav.filmingLocationTitle as Title,
                    }
                })
                .filter(Boolean) as ProcessedFilmingLocation[]
        }, [favoritesData, resolveLocationDescription])

    const locationIds = useMemo(
        () =>
            processedFavoriteLocations.map(item => ({
                id: item.processedFilmingLocation.id,
            })),
        [processedFavoriteLocations],
    )

    const {
        selectedLocationId,
        scrollAreaRef,
        locationItemRefs,
        handleLocationClick,
        handleMarkerClick,
    } = useLocationSelection({
        locations: locationIds,
        defaultToFirstLocation: true,
    })

    if (!isLoadingFavorites && processedFavoriteLocations.length === 0) {
        return (
            <FadeContent blur duration={500}>
                <Heading
                    title={t('noLocations.heading')}
                    description={t('noLocations.description')}
                    size='md'
                />
            </FadeContent>
        )
    }

    return (
        <FilmingLocationsContent
            locationsToDisplay={processedFavoriteLocations}
            isLoading={isLoadingFavorites}
            selectedLocationId={selectedLocationId}
            onLocationListItemClick={handleLocationClick}
            onMapMarkerClick={handleMarkerClick}
            mapHeight='30rem'
            listHeight='calc(30rem - 1rem)'
            showSearchControl={false}
            baseClusterSourceId='favorite-locations'
            mapContextKey='global-favorites'
            scrollAreaRef={scrollAreaRef}
            locationItemRefs={locationItemRefs}
            mapStyle={MapStyle.HYBRID}
            enableMapTerrain
            enableMapProjection
            t={commonT}
        />
    )
}
