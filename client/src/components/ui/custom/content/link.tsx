import { cn } from '@/utils/tw-merge'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { AnchorHTMLAttributes, PropsWithChildren } from 'react'

interface LinkProps extends NextLinkProps {
    className?: string
}

export function Link({
    href,
    className,
    children,
    ...props
}: PropsWithChildren<LinkProps>) {
    return (
        <NextLink
            href={href}
            className={cn(
                'text-sm text-primary transition-colors hover:text-primary/80 hover:underline',
                className,
            )}
            {...props}
        >
            {children}
        </NextLink>
    )
}
