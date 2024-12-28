'use client'

import { useGetAllFilmingLocationsQuery } from '@/graphql/generated/output'

export default function Home() {
    const { data, loading } = useGetAllFilmingLocationsQuery({
        variables: {
            limit: 100,
        },
    })

    return (
        <div className='text-white'>
            {loading ? <span>loading...</span> : JSON.stringify(data)}
        </div>
    )
}
