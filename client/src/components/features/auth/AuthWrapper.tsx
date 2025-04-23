import { Card, CardContent, CardFooter } from '@/components/ui/common/card'
import AnimatedContent from '@/components/ui/custom/content/animated-content'
import { BorderBeam } from '@/components/ui/custom/content/border-beam'
import { Link } from '@/components/ui/custom/content/link'
import { MagicCard } from '@/components/ui/custom/content/magic-card'
import ShinyText from '@/components/ui/custom/text/shiny-text'
import { LogoImage } from '@/components/ui/elements/LogoImage'
import { useBackground } from '@/contexts/background-context'
import { memo, PropsWithChildren, ReactNode, useEffect } from 'react'

interface AuthWrapperProps {
    children: ReactNode
    heading: string
    backButtonLabel?: string
    backButtonHref?: string
    backButtonQuestion?: string
}

export const AuthWrapper = memo(function AuthWrapper({
    children,
    heading,
    backButtonLabel,
    backButtonHref,
    backButtonQuestion,
}: PropsWithChildren<AuthWrapperProps>) {
    const { setBackgroundType } = useBackground()

    useEffect(() => {
        setBackgroundType('particles')
        return () => setBackgroundType('default')
    }, [setBackgroundType])

    const showBackButton = Boolean(
        backButtonLabel && backButtonHref && backButtonQuestion,
    )

    return (
        <div className='flex min-h-screen flex-col items-center justify-center p-4'>
            <AnimatedContent
                distance={50}
                config={{ tension: 80, friction: 15 }}
                reverse
            >
                <div className='mb-6 flex flex-col items-center gap-y-2'>
                    <LogoImage />
                    <ShinyText
                        className='text-2xl font-bold text-foreground/80'
                        text={heading}
                        speed={3}
                    />
                </div>
            </AnimatedContent>

            <Card className='relative w-full max-w-[450px] overflow-hidden border-border/50 bg-background/60 shadow-md backdrop-blur-sm'>
                <MagicCard className='p-0'>
                    <CardContent className='px-6 pt-6 sm:px-8'>
                        <AnimatedContent
                            distance={100}
                            config={{ tension: 80, friction: 15 }}
                        >
                            {children}
                        </AnimatedContent>
                    </CardContent>

                    {showBackButton && (
                        <AnimatedContent
                            distance={150}
                            config={{ tension: 80, friction: 15 }}
                            direction='horizontal'
                        >
                            <CardFooter className='px-6 pb-6 sm:px-8'>
                                <div className='flex w-full flex-row items-center justify-center gap-x-1'>
                                    <span className='text-sm text-muted-foreground'>
                                        {backButtonQuestion}
                                    </span>
                                    <Link href={backButtonHref!}>
                                        {backButtonLabel}
                                    </Link>
                                </div>
                            </CardFooter>
                        </AnimatedContent>
                    )}
                </MagicCard>

                <BorderBeam
                    duration={6}
                    size={400}
                    className='from-transparent via-secondary to-transparent opacity-60'
                />
                <BorderBeam
                    duration={6}
                    delay={3}
                    size={400}
                    className='from-transparent via-primary to-transparent opacity-40'
                />
            </Card>
        </div>
    )
})
