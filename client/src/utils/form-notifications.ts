import { toast } from 'sonner'

export interface NotificationMessages {
    successMessage?: string
    errorMessage?: string
    errorDescription?: string
    successDuration?: number
    errorDuration?: number
}

export const showFormSuccess = (message: string, duration?: number) => {
    toast.success(message, duration ? { duration } : undefined)
}

export const showFormError = (
    message: string,
    options?: { description?: string; duration?: number },
) => {
    toast.error(message, options)
}

export const createFormNotificationHandlers = (
    messages: NotificationMessages,
) => {
    const handleSuccess = () => {
        if (messages.successMessage) {
            showFormSuccess(messages.successMessage, messages.successDuration)
        }
    }

    const handleError = () => {
        if (messages.errorMessage) {
            showFormError(messages.errorMessage, {
                description: messages.errorDescription,
                duration: messages.errorDuration,
            })
        }
    }

    return { handleSuccess, handleError }
}
