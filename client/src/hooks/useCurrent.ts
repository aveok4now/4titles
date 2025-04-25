import {
    useClearSessionCookieMutation,
    useFindProfileQuery,
} from '@/graphql/generated/output'
import { useEffect } from 'react'
import { useAuth } from './useAuth'

export function useCurrent() {
    const { isAuthenticated, unauthorize } = useAuth()

    const {
        data,
        loading: isLoadingProfile,
        refetch,
        error,
    } = useFindProfileQuery({
        skip: !isAuthenticated,
    })
    const [clear] = useClearSessionCookieMutation()

    useEffect(() => {
        if (error) {
            if (isAuthenticated) {
                clear()
            }
            unauthorize()
        }
    }, [isAuthenticated, unauthorize, clear])

    return {
        profile: data?.me,
        isLoadingProfile,
        refetch,
    }
}
