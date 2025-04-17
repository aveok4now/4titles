import { useCallback, useState } from 'react'
import { FieldValues, UseFormReturn } from 'react-hook-form'

export function useFormValidation<T extends FieldValues>(
    form: UseFormReturn<T>,
) {
    const [isSubmitted, setIsSubmitted] = useState(false)

    const { errors, isValid, isDirty } = form.formState
    const hasErrors = Object.keys(errors).length > 0

    const handleFormSubmit = useCallback(
        (e: React.FormEvent) => {
            if (!isSubmitted) {
                setIsSubmitted(true)

                if (!isValid) {
                    e.preventDefault()
                    form.trigger()
                }
            }
        },
        [isSubmitted, isValid, form],
    )

    const resetSubmitState = useCallback(() => {
        setIsSubmitted(false)
    }, [])

    const shouldShowErrors = isSubmitted

    const isSubmitDisabled = useCallback(
        (isLoading: boolean) => {
            return (
                isLoading ||
                (isSubmitted && hasErrors) ||
                (!isDirty && !isValid)
            )
        },
        [isSubmitted, hasErrors, isDirty, isValid],
    )

    const isStrictValidationMode = useCallback(
        (isLoading: boolean) => {
            return (isSubmitted && hasErrors) || isLoading
        },
        [isSubmitted, hasErrors],
    )

    const hasAnyValues = useCallback(() => {
        const values = form.getValues()
        return Object.keys(values).some(key => {
            const value = values[key]
            return value !== undefined && value !== null && value !== ''
        })
    }, [form])

    const isEmptyFormDisabled = useCallback(
        (isLoading: boolean) => {
            if (isSubmitted && hasErrors) return true
            if (isLoading) return true
            if (!hasAnyValues()) return true

            return false
        },
        [isSubmitted, hasErrors, hasAnyValues],
    )

    return {
        isSubmitted,
        setIsSubmitted,
        hasErrors,
        isValid,
        isDirty,
        handleFormSubmit,
        shouldShowErrors,
        isSubmitDisabled,
        isStrictValidationMode,
        isEmptyFormDisabled,
        resetSubmitState,
    }
}
