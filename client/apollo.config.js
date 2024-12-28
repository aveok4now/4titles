import 'dotenv/config'

export const service = {
    endpoint: {
        url: process.env.NEXT_PUBLIC_SERVER_URL,
        skipSSLValidation: true,
    },
}
