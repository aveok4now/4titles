'use client'

import { useGetAllFilmingLocationsQuery } from '@/graphql/generated/output'

export default function Home() {
    const { data, loading } = useGetAllFilmingLocationsQuery({
        variables: {
            limit: 100,
        },
    })

    return (
        <div className='w-full max-w-full break-words p-2'>
            {loading ? <span>loading...</span> : JSON.stringify(data)}
        </div>
    )
}
