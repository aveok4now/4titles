import type { PropsWithChildren } from 'react'
import { CardContent, CardHeader, CardTitle } from '../common/card'
import { BeamAnimatedCard } from './BeamAnimatedCard'
import { Heading } from './Heading'

interface FormWrapperProps {
    heading?: string
    showHeader?: boolean
}

export function FormWrapper({
    children,
    heading = '',
    showHeader = true,
}: PropsWithChildren<FormWrapperProps>) {
    return (
        <BeamAnimatedCard>
            {showHeader && (
                <CardHeader className='p-4'>
                    <CardTitle>
                        <Heading title={heading} size='sm' />
                    </CardTitle>
                </CardHeader>
            )}
            <CardContent className='p-0'>{children}</CardContent>
        </BeamAnimatedCard>
    )
}
