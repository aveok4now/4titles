import { useState } from 'react'
import { FieldValues, UseFormReturn } from 'react-hook-form'

export function useFormValidation<T extends FieldValues>(
    form: UseFormReturn<T>,
) {
    const [isSubmitted, setIsSubmitted] = useState(false)

    const { errors, isValid } = form.formState
    const hasErrors = Object.keys(errors).length > 0

    const handleFormSubmit = (e: React.FormEvent) => {
        if (!isSubmitted) {
            setIsSubmitted(true)

            if (!isValid) {
                e.preventDefault()
                form.trigger()
            }
        }
    }

    const shouldShowErrors = isSubmitted

    const isSubmitDisabled = (isLoading: boolean) => {
        return isLoading || (isSubmitted && hasErrors)
    }

    return {
        isSubmitted,
        setIsSubmitted,
        hasErrors,
        isValid,
        handleFormSubmit,
        shouldShowErrors,
        isSubmitDisabled,
    }
}
