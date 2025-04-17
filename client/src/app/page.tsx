'use client'

import { useTitlesQuery } from '@/graphql/generated/output'

export default function Home() {
    const { data, loading } = useTitlesQuery({
        variables: {
            filter: { limit: 100 },
        },
    })

    return (
        <div className='w-full max-w-full p-2 break-words'>
            {loading ? <span>loading...</span> : JSON.stringify(data)}
        </div>
    )
}
