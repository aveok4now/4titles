import { cn } from '@/utils/tw-merge'
import { HTMLAttributes } from 'react'

interface CollectionPageWrapperProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export function CollectionPageWrapper({
    children,
    className,
    maxWidth = '2xl',
    ...props
}: CollectionPageWrapperProps) {
    const maxWidthClasses = {
        sm: 'max-w-screen-sm',
        md: 'max-w-screen-md',
        lg: 'max-w-screen-lg',
        xl: 'max-w-screen-xl',
        '2xl': 'max-w-screen-2xl',
        full: 'max-w-full',
    }

    return (
        <div
            className={cn(
                'container mx-auto px-4 py-8',
                maxWidthClasses[maxWidth],
                className,
            )}
            {...props}
        >
            {children}
        </div>
    )
}
