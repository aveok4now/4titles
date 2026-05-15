import { CollectionDetails } from '@/components/features/collections/details/CollectionDetails'
import {
    FindCollectionBySlugDocument,
    type FindCollectionBySlugQuery,
} from '@/graphql/generated/output'
import { SERVER_URL } from '@/libs/constants/url.constants'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

async function findCollectionBySlug(params: { slug: string }) {
    try {
        const query = FindCollectionBySlugDocument.loc?.source.body
        const variables = { slug: params.slug }

        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, variables }),
            next: {
                revalidate: 30,
            },
        })

        if (!response.ok) {
            throw new Error(`Error fetching collection: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`)
        }

        return {
            collection: data.data
                .findCollectionBySlug as FindCollectionBySlugQuery['findCollectionBySlug'],
        }
    } catch (error) {
        console.error('Error fetching collection:', error)
        return notFound()
    }
}

export async function generateMetadata(props: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const t = await getTranslations('collections')
    const params = await props.params

    const { collection } = await findCollectionBySlug(params)
    const { title, description, coverImage } = collection

    return {
        title: t('details.title', { title }),
        description: description || undefined,
        openGraph: {
            images: coverImage ? [{ url: coverImage, alt: title }] : undefined,
        },
    }
}

export default async function CollectionPage(props: {
    params: Promise<{ slug: string }>
}) {
    const params = await props.params
    const { collection } = await findCollectionBySlug(params)

    return <CollectionDetails initialCollection={collection} />
}
