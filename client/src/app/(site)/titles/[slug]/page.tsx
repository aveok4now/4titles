import { TitleDetails } from '@/components/features/titles/details'
import {
    FindTitleBySlugDocument,
    FindTitleBySlugQuery,
    Title,
} from '@/graphql/generated/output'
import { SERVER_URL } from '@/libs/constants/url.constants'
import { getLocalizedTitleData } from '@/utils/title/title-localization'
import { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

async function findTitleBySlug(params: { slug: string }) {
    try {
        const query = FindTitleBySlugDocument.loc?.source.body
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

        const data = await response.json()

        return {
            title: data.data
                .findTitleBySlug as FindTitleBySlugQuery['findTitleBySlug'],
        }
    } catch (error) {
        return notFound()
    }
}

export async function generateMetadata(props: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const locale = await getLocale()
    const params = await props.params

    const { title } = await findTitleBySlug(params)
    const {
        name: titleName,
        overview: description,
        posterUrl,
    } = getLocalizedTitleData(title as Title, locale)

    return {
        title: titleName,
        description,
        openGraph: {
            images: [
                {
                    url: posterUrl,
                    alt: titleName,
                },
            ],
        },
    }
}

export default async function TitlePage(props: {
    params: Promise<{ slug: string }>
}) {
    const params = await props.params
    const { title } = await findTitleBySlug(params)

    return <TitleDetails title={title} />
}
