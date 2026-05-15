import { ProfileView } from '@/components/features/user/profile/ProfileView'
import {
    FindProfileByUsernameDocument,
    type FindProfileByUsernameQuery,
} from '@/graphql/generated/output'
import { SERVER_URL } from '@/libs/constants/url.constants'
import { notFound } from 'next/navigation'

async function findProfileByUsername(params: { username: string }) {
    try {
        const query = FindProfileByUsernameDocument.loc?.source.body
        const variables = { username: params.username }

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
            profile: data.data
                .findProfileByUsername as FindProfileByUsernameQuery['findProfileByUsername'],
        }
    } catch (error) {
        console.error(error)
        return notFound()
    }
}

export default async function ProfilePage(props: {
    params: Promise<{ username: string }>
}) {
    const params = await props.params

    const { profile } = await findProfileByUsername(params)

    return <ProfileView profile={profile} />
}
