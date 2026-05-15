'use client'

import { cn } from '@/utils/tw-merge'
import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle, Loader2 } from 'lucide-react'
import { HTMLMotionProps, motion } from 'motion/react'
import * as React from 'react'

export type TimelineSize = 'sm' | 'md' | 'lg'
export type TimelineColor =
    | 'primary'
    | 'secondary'
    | 'muted'
    | 'accent'
    | 'destructive'
export type TimelineStatus = 'completed' | 'in-progress' | 'pending'

export interface TimelineElement {
    id: number
    date: string
    title: string
    description: string
    icon?: React.ReactNode | (() => React.ReactNode)
    status?: TimelineStatus
    color?: TimelineColor
    size?: TimelineSize
    loading?: boolean
    error?: string
}

const timelineVariants = cva('flex flex-col relative', {
    variants: {
        size: {
            sm: 'gap-4',
            md: 'gap-6',
            lg: 'gap-8',
        },
    },
    defaultVariants: {
        size: 'md',
    },
})

interface TimelineProps
    extends React.HTMLAttributes<HTMLOListElement>,
        VariantProps<typeof timelineVariants> {
    iconsize?: 'sm' | 'md' | 'lg'
}

const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
    ({ className, iconsize, size, children, ...props }, ref) => {
        const items = React.Children.toArray(children)

        if (items.length === 0) {
            return <TimelineEmpty />
        }

        return (
            <ol
                ref={ref}
                aria-label='Timeline'
                className={cn(
                    timelineVariants({ size }),
                    'relative mx-auto min-h-[600px] w-full max-w-2xl py-8',
                    className,
                )}
                {...props}
            >
                {React.Children.map(children, (child, index) => {
                    if (
                        React.isValidElement(child) &&
                        typeof child.type !== 'string' &&
                        'displayName' in child.type &&
                        child.type.displayName === 'TimelineItem'
                    ) {
                        return React.cloneElement(child, {
                            iconsize,
                            showConnector: index !== items.length - 1,
                        } as React.ComponentProps<typeof TimelineItem>)
                    }
                    return child
                })}
            </ol>
        )
    },
)
Timeline.displayName = 'Timeline'

interface TimelineItemProps extends Omit<HTMLMotionProps<'li'>, 'ref'> {
    date?: string
    title?: string
    description?: string
    icon?: React.ReactNode
    iconColor?: TimelineColor
    status?: 'completed' | 'in-progress' | 'pending'
    connectorColor?: TimelineColor
    showConnector?: boolean
    iconsize?: 'sm' | 'md' | 'lg'
    loading?: boolean
    error?: string
}

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
    (
        {
            className,
            date,
            title,
            description,
            icon,
            iconColor,
            status = 'completed',
            connectorColor,
            showConnector = true,
            iconsize,
            loading,
            error,
            initial,
            animate,
            transition,
            ...props
        },
        ref,
    ) => {
        const commonClassName = cn('relative w-full mb-8 last:mb-0', className)

        if (loading) {
            return (
                <motion.li
                    ref={ref}
                    className={commonClassName}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    role='status'
                    {...props}
                >
                    <div className='grid grid-cols-[minmax(auto,8rem)_auto_1fr] items-start px-4'>
                        <div className='pr-4 text-right'>
                            <div className='h-4 w-24 animate-pulse rounded bg-muted' />
                        </div>

                        <div className='mx-3 flex flex-col items-center justify-start gap-y-2'>
                            <div className='relative flex h-8 w-8 animate-pulse items-center justify-center rounded-full bg-muted ring-8 ring-background'>
                                <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                            </div>
                            {showConnector && (
                                <div className='h-full w-0.5 animate-pulse bg-muted' />
                            )}
                        </div>

                        <div className='flex flex-col gap-2 pl-2'>
                            <div className='space-y-2'>
                                <div className='h-4 w-24 animate-pulse rounded bg-muted' />
                                <div className='h-3 w-48 animate-pulse rounded bg-muted' />
                            </div>
                        </div>
                    </div>
                </motion.li>
            )
        }

        if (error) {
            return (
                <motion.li
                    ref={ref}
                    className={cn(
                        commonClassName,
                        'border border-destructive/50 bg-destructive/10',
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    role='alert'
                    {...props}
                >
                    <div className='grid grid-cols-[minmax(auto,8rem)_auto_1fr] items-start px-4'>
                        <div className='pr-4 text-right'>
                            <TimelineTime className='text-destructive'>
                                {date}
                            </TimelineTime>
                        </div>

                        <div className='mx-3 flex flex-col items-center justify-start gap-y-2'>
                            <div className='relative flex h-8 w-8 items-center justify-center rounded-full bg-destructive/20 ring-8 ring-background'>
                                <AlertCircle className='h-4 w-4 text-destructive' />
                            </div>
                            {showConnector && (
                                <TimelineConnector
                                    status='pending'
                                    className='h-full'
                                />
                            )}
                        </div>

                        <div className='flex flex-col gap-2 pl-2'>
                            <TimelineHeader>
                                <TimelineTitle className='text-destructive'>
                                    {title || 'Error'}
                                </TimelineTitle>
                            </TimelineHeader>
                            <TimelineDescription className='text-destructive'>
                                {error}
                            </TimelineDescription>
                        </div>
                    </div>
                </motion.li>
            )
        }

        const content = (
            <div
                className='grid grid-cols-[1fr_auto_1fr] items-start gap-4'
                {...(status === 'in-progress'
                    ? { 'aria-current': 'step' }
                    : {})}
            >
                <div className='flex flex-col justify-start pt-1'>
                    <TimelineTime className='pr-4 text-right'>
                        {date}
                    </TimelineTime>
                </div>

                <div className='flex flex-col items-center'>
                    <div className='relative z-10'>
                        <TimelineIcon
                            icon={icon}
                            color={iconColor}
                            status={status}
                            iconSize={iconsize}
                        />
                    </div>
                    {showConnector && (
                        <div className='mt-2 h-16 w-0.5 bg-border' />
                    )}
                </div>

                <TimelineContent>
                    <TimelineHeader>
                        <TimelineTitle>{title}</TimelineTitle>
                    </TimelineHeader>
                    <TimelineDescription>{description}</TimelineDescription>
                </TimelineContent>
            </div>
        )

        const {
            style,
            onDrag,
            onDragStart,
            onDragEnd,
            onAnimationStart,
            onAnimationComplete,
            transformTemplate,
            whileHover,
            whileTap,
            whileDrag,
            whileFocus,
            whileInView,
            ...filteredProps
        } = props

        return (
            <li ref={ref} className={commonClassName} {...filteredProps}>
                {content}
            </li>
        )
    },
)
TimelineItem.displayName = 'TimelineItem'

interface TimelineTimeProps extends React.HTMLAttributes<HTMLTimeElement> {
    date?: string | Date | number
    format?: Intl.DateTimeFormatOptions
}

const defaultDateFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
}

const TimelineTime = React.forwardRef<HTMLTimeElement, TimelineTimeProps>(
    ({ className, date, format, children, ...props }, ref) => {
        const formattedDate = React.useMemo(() => {
            if (!date) return ''

            try {
                const dateObj = new Date(date)
                if (isNaN(dateObj.getTime())) return ''

                return new Intl.DateTimeFormat('en-US', {
                    ...defaultDateFormat,
                    ...format,
                }).format(dateObj)
            } catch (error) {
                console.error('Error formatting date:', error)
                return ''
            }
        }, [date, format])

        return (
            <time
                ref={ref}
                dateTime={date ? new Date(date).toISOString() : undefined}
                className={cn(
                    'text-sm font-medium tracking-tight text-muted-foreground',
                    className,
                )}
                {...props}
            >
                {children || formattedDate}
            </time>
        )
    },
)
TimelineTime.displayName = 'TimelineTime'

const TimelineConnector = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        status?: 'completed' | 'in-progress' | 'pending'
        color?: 'primary' | 'secondary' | 'muted' | 'accent'
    }
>(({ className, status = 'completed', color, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'w-0.5',
            {
                'bg-primary':
                    color === 'primary' || (!color && status === 'completed'),
                'bg-muted':
                    color === 'muted' || (!color && status === 'pending'),
                'bg-secondary': color === 'secondary',
                'bg-accent': color === 'accent',
                'bg-gradient-to-b from-primary to-muted':
                    !color && status === 'in-progress',
            },
            className,
        )}
        {...props}
    />
))
TimelineConnector.displayName = 'TimelineConnector'

const TimelineHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex items-center gap-4', className)}
        {...props}
    />
))
TimelineHeader.displayName = 'TimelineHeader'

const TimelineTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            'font-semibold leading-none tracking-tight text-secondary',
            className,
        )}
        {...props}
    >
        {children}
    </h3>
))
TimelineTitle.displayName = 'TimelineTitle'

const TimelineIcon = ({
    icon,
    color = 'primary',
    status = 'completed',
    iconSize = 'md',
}: {
    icon?: React.ReactNode
    color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'destructive'
    status?: 'completed' | 'in-progress' | 'pending' | 'error'
    iconSize?: 'sm' | 'md' | 'lg'
}) => {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
    }

    const iconSizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    }

    const colorClasses = {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        muted: 'bg-muted text-muted-foreground',
        accent: 'bg-accent text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
    }

    return (
        <div
            className={cn(
                'relative flex items-center justify-center rounded-full shadow-sm ring-8 ring-background',
                sizeClasses[iconSize],
                colorClasses[color],
            )}
        >
            {icon ? (
                <div
                    className={cn(
                        'flex items-center justify-center',
                        iconSizeClasses[iconSize],
                    )}
                >
                    {icon}
                </div>
            ) : (
                <div
                    className={cn('rounded-full', iconSizeClasses[iconSize])}
                />
            )}
        </div>
    )
}

const TimelineDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn('max-w-sm text-sm text-muted-foreground', className)}
        {...props}
    />
))
TimelineDescription.displayName = 'TimelineDescription'

const TimelineContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex flex-col gap-2 pl-2', className)}
        {...props}
    />
))
TimelineContent.displayName = 'TimelineContent'

const TimelineEmpty = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'flex flex-col items-center justify-center p-8 text-center',
            className,
        )}
        {...props}
    >
        <p className='text-sm text-muted-foreground'>
            {children || 'No timeline items to display'}
        </p>
    </div>
))
TimelineEmpty.displayName = 'TimelineEmpty'

export {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDescription,
    TimelineEmpty,
    TimelineHeader,
    TimelineIcon,
    TimelineItem,
    TimelineTime,
    TimelineTitle,
}
