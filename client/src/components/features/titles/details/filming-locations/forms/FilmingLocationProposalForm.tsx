'use client'

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/common/form'
import { Textarea } from '@/components/ui/common/textarea'
import { SubmitButton } from '@/components/ui/elements/SubmitButton'
import { Map } from '@/components/ui/elements/map'
import { MapLocationChangeEvent } from '@/components/ui/elements/map/types'
import {
    CreateFilmingLocationProposalMutation,
    FilmingLocation,
    FilmingLocationProposalType,
    useCreateFilmingLocationProposalMutation,
} from '@/graphql/generated/output'
import {
    FilmingLocationProposalSchemaType,
    filmingLocationProposalSchema,
} from '@/schemas/content/filming-location-proposal.schema'
import { createFormNotificationHandlers } from '@/utils/form-notifications'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapStyle } from '@maptiler/sdk'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

interface FilmingLocationProposalFormProps {
    type: FilmingLocationProposalType
    titleId: string
    location?: FilmingLocation
    onSuccess: () => void
}

export function FilmingLocationProposalForm({
    type,
    titleId,
    location,
    onSuccess,
}: FilmingLocationProposalFormProps) {
    const t = useTranslations('titleDetails.filmingLocations.proposalForm')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentAddress, setCurrentAddress] = useState<string>(
        location?.address || '',
    )
    const [currentCoordinates, setCurrentCoordinates] = useState<
        [number, number] | null
    >(
        location?.coordinates?.x && location?.coordinates?.y
            ? [location.coordinates.x, location.coordinates.y]
            : null,
    )

    const form = useForm<FilmingLocationProposalSchemaType>({
        resolver: zodResolver(
            filmingLocationProposalSchema({
                address: {
                    minLengthError: t('validationMessages.addressMinLength'),
                    maxLengthError: t('validationMessages.addressMaxLength'),
                },
                description: {
                    minLengthError: t(
                        'validationMessages.descriptionMinLength',
                    ),
                    maxLengthError: t(
                        'validationMessages.descriptionMaxLength',
                    ),
                },
                reason: {
                    requiredError: t('validationMessages.reasonRequired'),
                    minLengthError: t('validationMessages.reasonMinLength'),
                    maxLengthError: t('validationMessages.reasonMaxLength'),
                },
            }),
        ),
        defaultValues: {
            address: location?.address || '',
            description: location?.description || '',
            reason: '',
        },
    })

    const { handleSuccess, handleError } = createFormNotificationHandlers({
        successMessage: t('successMessage'),
        errorMessage: t('errorMessage'),
        errorDescription: t('errorMessageDescription'),
    })

    const [createFilmingLocationProposal] =
        useCreateFilmingLocationProposalMutation({
            onCompleted(data: CreateFilmingLocationProposalMutation) {
                setIsSubmitting(false)
                if (data.createFilmingLocationProposal) {
                    handleSuccess()
                    onSuccess()
                    form.reset()
                } else {
                    handleError()
                }
            },
            onError() {
                setIsSubmitting(false)
                handleError()
            },
        })

    const handleLocationChange = useCallback(
        (event: MapLocationChangeEvent) => {
            setCurrentAddress(event.address)
            setCurrentCoordinates(event.coordinates)
            form.setValue('address', event.address)
        },
        [form],
    )

    const onSubmit = (data: FilmingLocationProposalSchemaType) => {
        setIsSubmitting(true)
        createFilmingLocationProposal({
            variables: {
                input: {
                    type,
                    titleId,
                    locationId: location?.id,
                    address: currentAddress,
                    description: data.description,
                    reason: data.reason || '',
                    coordinates: currentCoordinates
                        ? { x: currentCoordinates[0], y: currentCoordinates[1] }
                        : undefined,
                },
            },
        })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='mt-4 flex flex-col gap-4'
            >
                <div className='h-[20rem] w-full'>
                    <Map
                        center={
                            currentCoordinates ||
                            (location?.coordinates?.x &&
                            location?.coordinates?.y
                                ? [
                                      location.coordinates.x,
                                      location.coordinates.y,
                                  ]
                                : [80, 20])
                        }
                        height='20rem'
                        width='100%'
                        enableGeocoding
                        enableDraggableMarker
                        onLocationChange={handleLocationChange}
                        initialAddress={currentAddress}
                        style={MapStyle.HYBRID}
                    />
                </div>

                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('descriptionLabel')}</FormLabel>
                            <Textarea
                                placeholder={t('descriptionPlaceholder')}
                                rows={5}
                                className='resize-none'
                                {...field}
                            />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='reason'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {t(
                                    `${type === FilmingLocationProposalType.Add ? 'add' : 'edit'}.reasonLabel`,
                                )}
                            </FormLabel>
                            <Textarea
                                placeholder={t(
                                    `${type === FilmingLocationProposalType.Add ? 'add' : 'edit'}.reasonPlaceholder`,
                                )}
                                rows={3}
                                className='resize-none'
                                {...field}
                            />
                        </FormItem>
                    )}
                />

                <SubmitButton
                    loading={isSubmitting}
                    disabled={!form.formState.isValid || isSubmitting}
                    label={t('submitButton')}
                    className='mb-2 md:mb-0'
                />
            </form>
        </Form>
    )
}
