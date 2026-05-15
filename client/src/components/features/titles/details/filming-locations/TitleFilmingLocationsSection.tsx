'use client'

import type { ProcessedFilmingLocation } from '@/components/features/filming-locations/FilmingLocationsContent'
import type {
    FilmingLocation,
    Title,
    TitleFilmingLocation,
} from '@/graphql/generated/output'

import { FilmingLocationsContent } from '@/components/features/filming-locations'
import { useLocationSelection } from '@/components/features/filming-locations/hooks'
import { Button } from '@/components/ui/common/button'
import { useSearchTitleFilmingLocationsLazyQuery } from '@/graphql/generated/output'
import { useAuth } from '@/hooks/useAuth'
import { getLocalizedFilmingLocationDescription } from '@/utils/filming-location/filming-location-localization'
import { getLocalizedTitleName } from '@/utils/title/title-localization'
import { MapStyle } from '@maptiler/sdk'
import { PlusCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { TitleSectionContainer } from '../TitleSectionContainer'
import { AddFilmingLocationDialog } from './dialogs'

interface TitleFilmingLocationsSectionProps {
    filmingLocations: TitleFilmingLocation[]
    title: Title
    locale: string
}

export function TitleFilmingLocationsSection({
    filmingLocations: initialFilmingLocations,
    title,
    locale,
}: TitleFilmingLocationsSectionProps) {
    const t = useTranslations('titleDetails.filmingLocations')
    const searchParams = useSearchParams()
    const locationParam = searchParams.get('location')
    const { isAuthenticated } = useAuth()

    const [searchQuery, setSearchQuery] = useState<string>('')
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [searchResults, setSearchResults] = useState<
        TitleFilmingLocation[] | null
    >(null)
    const [isAddLocationDialogOpen, setIsAddLocationDialogOpen] =
        useState(false)

    const [searchLocationsMutation, { loading: isLoadingSearch }] =
        useSearchTitleFilmingLocationsLazyQuery()

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

    const handleSearch = useCallback(
        async (query: string) => {
            setSearchQuery(query)

            if (!query.trim()) {
                setIsSearching(false)
                setSearchResults(null)
                return
            }

            if (query.trim().length < 3) return

            setIsSearching(true)
            try {
                const { data } = await searchLocationsMutation({
                    variables: {
                        titleId: title.id,
                        query: query.trim(),
                    },
                })
                const results =
                    (data?.searchTitleFilmingLocations as TitleFilmingLocation[]) ||
                    []
                setSearchResults(results)

                if (results.length > 0 && !locationParam) {
                    const firstResultId = results[0].filmingLocation!.id
                    setSelectedLocationId(firstResultId)
                    setTimeout(() => {
                        const el = locationItemRefs.current[firstResultId]
                        if (el && scrollAreaRef.current) {
                            el.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center',
                                inline: 'nearest',
                            })
                        }
                    }, 100)
                } else if (results.length === 0 && !locationParam) {
                    setSelectedLocationId(null)
                }
            } catch (error) {
                console.error('Error searching filming locations:', error)
                setSearchResults([])
                if (!locationParam) setSelectedLocationId(null)
            } finally {
                setIsSearching(false)
            }
        },
        [searchLocationsMutation, title.id, locationParam],
    )

    const processedLocationsToDisplay: ProcessedFilmingLocation[] =
        useMemo(() => {
            const locationsToProcess = searchResults || initialFilmingLocations
            return locationsToProcess
                .map(item => {
                    if (!item.filmingLocation) return null
                    const resolvedDescription = resolveLocationDescription(
                        item.filmingLocation,
                    )
                    return {
                        originalItem: item,
                        processedFilmingLocation: {
                            ...item.filmingLocation,
                            description: resolvedDescription,
                        },
                        titleForListItem: title,
                    }
                })
                .filter(Boolean) as unknown as ProcessedFilmingLocation[]
        }, [
            initialFilmingLocations,
            searchResults,
            resolveLocationDescription,
            title,
        ])

    const locationIds = useMemo(
        () =>
            processedLocationsToDisplay.map(item => ({
                id: item.processedFilmingLocation.id,
            })),
        [processedLocationsToDisplay],
    )

    const {
        selectedLocationId,
        setSelectedLocationId,
        scrollAreaRef,
        locationItemRefs,
        handleLocationClick,
        handleMarkerClick,
    } = useLocationSelection({
        locations: locationIds,
        defaultToFirstLocation: !searchQuery,
        locationParam: locationParam,
    })

    const handleAddLocationClick = () => {
        if (!isAuthenticated) {
            toast.error(t('addLocation.authRequiredMessage'))
            return
        }
        setIsAddLocationDialogOpen(true)
    }

    const mapContextKey = useMemo(() => {
        return title.tmdbId
            ? `title-${title.tmdbId}`
            : `title-${title.id.substring(0, 8)}`
    }, [title.id, title.tmdbId])

    const clusterSourceId = useMemo(() => {
        return 'title-locations'
    }, [])

    return (
        <TitleSectionContainer
            delay={300}
            className='relative'
            title={t('heading')}
            description={
                initialFilmingLocations.length > 0
                    ? t('description', {
                          title: getLocalizedTitleName(title, locale),
                      })
                    : t('emptyDescription', {
                          type: title.type,
                          title: getLocalizedTitleName(title, locale),
                      })
            }
            action={
                <Button
                    onClick={handleAddLocationClick}
                    className='ml-0 mr-4 md:ml-8'
                    variant='outline'
                >
                    <PlusCircle className='mr-2 size-4' />
                    {t('addLocation.heading')}
                </Button>
            }
        >
            <FilmingLocationsContent
                locationsToDisplay={processedLocationsToDisplay}
                isLoading={isLoadingSearch || isSearching}
                selectedLocationId={selectedLocationId}
                onLocationListItemClick={handleLocationClick}
                onMapMarkerClick={handleMarkerClick}
                mapHeight='25rem'
                listHeight='calc(25rem - 3rem - 1rem)'
                showSearchControl
                searchQuery={searchQuery}
                onSearchHandler={handleSearch}
                isSearchingInput={isSearching}
                baseClusterSourceId={clusterSourceId}
                mapContextKey={mapContextKey}
                searchNoResultsText={t('search.noResults')}
                scrollAreaRef={scrollAreaRef}
                locationItemRefs={locationItemRefs}
                mapStyle={MapStyle.HYBRID}
                enableMapTerrain
                enableMapProjection
                listItemProps={{ t }}
                titleContext={title}
                t={t}
            />

            <AddFilmingLocationDialog
                isOpen={isAddLocationDialogOpen}
                onClose={() => setIsAddLocationDialogOpen(false)}
                title={title}
            />
        </TitleSectionContainer>
    )
}
