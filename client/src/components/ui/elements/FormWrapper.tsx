import type { PropsWithChildren } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../common/card'
import { Heading } from './Heading'

interface FormWrapperProps {
    heading: string
}

export function FormWrapper({
    children,
    heading,
}: PropsWithChildren<FormWrapperProps>) {
    return (
        <Card className='bg-card/90'>
            <CardHeader className='p-4'>
                <CardTitle>
                    <Heading title={heading} size='sm' />
                </CardTitle>
            </CardHeader>
            <CardContent className='p-0'>{children}</CardContent>
        </Card>
    )
}
