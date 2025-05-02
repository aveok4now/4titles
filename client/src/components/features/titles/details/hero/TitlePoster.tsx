'use client'

import {
    MorphingDialog,
    MorphingDialogClose,
    MorphingDialogContainer,
    MorphingDialogContent,
    MorphingDialogImage,
    MorphingDialogTrigger,
} from '@/components/ui/custom/content/morphing-dialog'
import TiltedCard from '@/components/ui/custom/content/tilted-card'
import { LogoImage } from '@/components/ui/elements/LogoImage'

import { XIcon } from 'lucide-react'

interface TitlePosterProps {
    posterUrl: string | null
    title: string
}

export function TitlePoster({ posterUrl, title }: TitlePosterProps) {
    if (!posterUrl) {
        return (
            <div className='relative aspect-[2/3]'>
                <div className='flex h-full w-full items-center justify-center bg-background/50'>
                    <LogoImage className='size-40' />
                </div>
            </div>
        )
    }

    return (
        <MorphingDialog
            transition={{
                duration: 0.3,
                ease: 'easeInOut',
            }}
        >
            <MorphingDialogTrigger className='relative aspect-[2/3] w-full cursor-pointer'>
                <TiltedCard
                    image={{
                        src: posterUrl,
                        alt: title,
                        fill: true,
                        priority: true,
                    }}
                    imageClassName='object-cover pointer-events-none select-none'
                    containerClassName='w-full h-full'
                    containerHeight='100%'
                    containerWidth='100%'
                    imageHeight='100%'
                    imageWidth='100%'
                    scaleOnHover={1.05}
                    rotateAmplitude={8}
                />
            </MorphingDialogTrigger>

            <MorphingDialogContainer>
                <MorphingDialogContent className='relative max-h-[80vh] max-w-[80vw]'>
                    <MorphingDialogImage
                        src={posterUrl}
                        alt={title}
                        className='h-auto w-full max-w-[80vw] rounded-lg object-contain lg:max-h-[80vh]'
                    />
                </MorphingDialogContent>

                <MorphingDialogClose
                    className='fixed right-6 top-6 h-fit w-fit rounded-full bg-background/80 p-2 shadow-sm backdrop-blur-sm'
                    variants={{
                        initial: { opacity: 0 },
                        animate: {
                            opacity: 1,
                            transition: { delay: 0.2, duration: 0.2 },
                        },
                        exit: { opacity: 0, transition: { duration: 0.1 } },
                    }}
                >
                    <XIcon className='h-5 w-5 text-foreground/80' />
                </MorphingDialogClose>
            </MorphingDialogContainer>
        </MorphingDialog>
    )
}
