import { SERVER_URL } from '@/libs/constants/url.constants'
import 'dotenv/config'

export const service = {
    endpoint: {
        url: SERVER_URL,
        skipSSLValidation: true,
    },
}
