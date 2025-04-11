import { Input } from '@/components/ui/common/input'
import { Label } from '@/components/ui/common/label'
import type { ReactNode } from 'react'

interface InputWrapperProps {
    id: string
    label: string
    type?: string
    placeholder?: string
    required?: boolean
    error?: string
    children?: ReactNode
}

export function InputWrapper({
    id,
    label,
    type = 'text',
    placeholder,
    required = false,
    error,
    children,
}: InputWrapperProps) {
    return (
        <div className='space-y-2'>
            <div className='flex items-center justify-between'>
                <Label
                    htmlFor={id}
                    className='text-sm font-medium text-foreground/90'
                >
                    {label}
                </Label>
                {error && (
                    <span className='text-xs font-medium text-destructive'>
                        {error}
                    </span>
                )}
            </div>
            {children || (
                <Input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    className={`border-input/50 bg-background/50 focus:border-primary/50 ${error ? 'border-destructive' : ''}`}
                />
            )}
        </div>
    )
}
