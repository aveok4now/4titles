import { Card, CardContent, CardFooter } from '@/components/ui/common/card'
import { useBackground } from '@/contexts/background-context'
import Image from 'next/image'
import Link from 'next/link'
import { PropsWithChildren, ReactNode, useEffect } from 'react'

interface AuthWrapperProps {
    children: ReactNode
    heading: string
    backButtonLabel?: string
    backButtonHref?: string
    backButtonQuestion?: string
}

export function AuthWrapper({
    children,
    heading,
    backButtonLabel,
    backButtonHref,
    backButtonQuestion,
}: PropsWithChildren<AuthWrapperProps>) {
    const { setBackgroundType } = useBackground()

    useEffect(() => {
        setBackgroundType('aurora')
        return () => setBackgroundType('default')
    }, [setBackgroundType])

    return (
        <div className='flex min-h-screen flex-col items-center justify-center p-4'>
            <div className='mb-4'>
                <Image
                    src='/images/logo.svg'
                    alt='4Titles'
                    width={40}
                    height={40}
                />
            </div>
            <h1 className='mb-6 text-2xl font-bold'>{heading}</h1>
            <Card className='w-full max-w-[450px] border-border/50 bg-background/60 shadow-lg backdrop-blur-sm'>
                <CardContent className='px-6 pt-6 sm:px-8'>
                    {children}
                </CardContent>
                <CardFooter className='px-6 pb-6 sm:px-8'>
                    {backButtonLabel && backButtonHref && backButtonQuestion ? (
                        <div className='flex w-full flex-row items-center justify-center gap-x-1'>
                            <span className='text-sm text-muted-foreground'>
                                {backButtonQuestion}
                            </span>
                            <Link
                                href={backButtonHref}
                                className='text-sm text-primary transition-colors hover:text-primary/80 hover:underline'
                            >
                                {backButtonLabel}
                            </Link>
                        </div>
                    ) : null}
                </CardFooter>
            </Card>
        </div>
    )
}
