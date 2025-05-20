interface SessionInfoItemProps {
    label: string
    value: string
}

export function SessionInfoItem({ label, value }: SessionInfoItemProps) {
    return (
        <div className='flex items-start justify-start'>
            <span className='font-medium'>{label}</span>
            <span className='ml-2 text-muted-foreground'>{value}</span>
        </div>
    )
}
