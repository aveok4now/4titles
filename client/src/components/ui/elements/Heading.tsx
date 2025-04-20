import { type VariantProps, cva } from 'class-variance-authority'
import ShinyText from '../custom/text/shiny-text'

import { cn } from '@/utils/tw-merge'

const headingSizes = cva('', {
    variants: {
        size: {
            sm: 'text-lg',
            default: 'text-2xl',
            lg: 'text-4xl',
            xl: 'text-5xl',
        },
    },
    defaultVariants: {
        size: 'default',
    },
})

interface HeadingProps extends VariantProps<typeof headingSizes> {
    title: string
    description?: string
}

export function Heading({ size, title, description }: HeadingProps) {
    return (
        <div className='space-y-2'>
            <ShinyText
                className={cn(
                    'font-semibold text-foreground/85',
                    headingSizes({ size }),
                )}
                text={title}
            />

            {description && (
                <p className='text-muted-foreground'>{description}</p>
            )}
        </div>
    )
}
