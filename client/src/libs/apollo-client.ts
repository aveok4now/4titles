import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_SERVER_URL,
})

export const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
})
