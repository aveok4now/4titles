import { Button, ButtonProps } from '@/components/ui/common/button'
import { forwardRef } from 'react'

import { cn } from '@/utils/tw-merge'
import { Spinner } from './spinner'

export interface SubmitButtonProps extends ButtonProps {
    loading?: boolean
    label: string
}

export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
    ({ loading, label, className, disabled, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                type='submit'
                className={cn('h-11 w-full', className)}
                disabled={loading || disabled}
                {...props}
            >
                {loading ? <Spinner /> : label}
            </Button>
        )
    },
)

SubmitButton.displayName = 'SubmitButton'
