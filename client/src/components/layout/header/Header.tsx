import { BorderBeam } from '@/components/ui/custom/content/border-beam'
import { HeaderMenu } from './HeaderMenu'
import { Logo } from './Logo'
import { Search } from './Search'

export function Header() {
    return (
        <header className='relative flex h-full items-center gap-x-4 border-b border-border bg-card/90 p-4 backdrop-blur-sm'>
            <Logo />

            <div className='ml-auto flex flex-row gap-x-4'>
                <Search />
                <HeaderMenu />
            </div>

            <BorderBeam
                duration={10}
                size={250}
                className='from-transparent via-secondary to-transparent opacity-30'
            />
            <BorderBeam
                delay={3}
                duration={10}
                size={250}
                className='from-transparent via-primary to-transparent opacity-35'
            />
        </header>
    )
}
