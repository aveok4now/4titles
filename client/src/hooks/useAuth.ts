import { authStore } from '@/store/auth/auth.store'

export function useAuth() {
    const isAuthenticated = authStore(state => state.isAuthenticated)
    const setIsAuthenticated = authStore(state => state.setIsAuthenticated)

    const authorize = () => setIsAuthenticated(true)
    const unauthorize = () => setIsAuthenticated(false)

    return {
        isAuthenticated,
        authorize,
        unauthorize,
    }
}
