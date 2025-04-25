import type { CodegenConfig } from '@graphql-codegen/cli'
import 'dotenv/config'
import { SERVER_URL } from './src/libs/constants/url.constants'

const config: CodegenConfig = {
    schema: SERVER_URL,
    documents: ['./src/graphql/**/*.graphql'],
    generates: {
        './src/graphql/generated/output.ts': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-react-apollo',
            ],
        },
    },
    ignoreNoDocuments: true,
}

export default config
