import type { PropsWithChildren } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../common/card'
import { MagicCard } from '../custom/content/magic-card'
import { Heading } from './Heading'

interface FormWrapperProps {
    heading: string
}

export function FormWrapper({
    children,
    heading,
}: PropsWithChildren<FormWrapperProps>) {
    return (
        <Card className='overflow-hidden bg-card/90'>
            <MagicCard>
                <CardHeader className='p-4'>
                    <CardTitle>
                        <Heading title={heading} size='sm' />
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-0'>{children}</CardContent>
            </MagicCard>
        </Card>
    )
}
