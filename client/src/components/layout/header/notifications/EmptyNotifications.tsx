interface EmptyNotificationsProps {
    message: string
}

export function EmptyNotifications({ message }: EmptyNotificationsProps) {
    return (
        <div className='flex items-center justify-center py-4 text-center text-muted-foreground'>
            {message}
        </div>
    )
}
