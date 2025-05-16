import { SearchX } from 'lucide-react'

interface EmptySearchStateProps {
    emptyMessage: string
}

export function EmptySearchState({ emptyMessage }: EmptySearchStateProps) {
    return (
        <div className='flex flex-row items-center gap-x-2'>
            <SearchX className='size-4 text-muted-foreground' />
            <span className='text-muted-foreground'>{emptyMessage}</span>
        </div>
    )
}
