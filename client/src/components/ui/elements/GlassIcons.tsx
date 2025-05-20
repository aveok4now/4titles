import Link from 'next/link'
import React from 'react'

export interface GlassIconsItem {
    icon: React.ReactElement
    color: string
    label: string
    customClass?: string
    url?: string
}

export interface GlassIconsProps {
    items: GlassIconsItem[]
    className?: string
}

const gradientMapping: Record<string, string> = {
    blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
    purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
    red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
    indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
    orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
    green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))',
    primary: 'linear-gradient(hsl(var(--primary)), hsl(var(--primary)))',
}

const GlassIcons: React.FC<GlassIconsProps> = ({ items, className }) => {
    const getBackgroundStyle = (color: string): React.CSSProperties => {
        if (gradientMapping[color]) {
            return { background: gradientMapping[color] }
        }
        return { background: color }
    }

    const renderIcon = (item: GlassIconsItem, index: number) => {
        const iconButton = (
            <button
                type='button'
                aria-label={item.label}
                className={`group relative h-[4.5em] w-[4.5em] bg-transparent outline-none [-webkit-tap-highlight-color:transparent] [perspective:24em] [transform-style:preserve-3d] ${
                    item.customClass || ''
                }`}
            >
                <span
                    className='ease-[cubic-bezier(0.83,0,0.17,1)] absolute left-0 top-0 block h-full w-full origin-[100%_100%] rotate-[15deg] rounded-[1.25em] transition-[opacity,transform] duration-300 group-hover:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)]'
                    style={{
                        ...getBackgroundStyle(item.color),
                        boxShadow:
                            '0.5em -0.5em 0.75em hsla(223, 10%, 10%, 0.15)',
                    }}
                ></span>

                <span
                    className='ease-[cubic-bezier(0.83,0,0.17,1)] absolute left-0 top-0 flex h-full w-full origin-[80%_50%] transform rounded-[1.25em] bg-[hsla(0,0%,100%,0.15)] backdrop-blur-[0.75em] transition-[opacity,transform] duration-300 [-webkit-backdrop-filter:blur(0.75em)] group-hover:[transform:translateZ(2em)]'
                    style={{
                        boxShadow: '0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset',
                    }}
                >
                    <span
                        className='m-auto flex h-[1.5em] w-[1.5em] items-center justify-center'
                        aria-hidden='true'
                    >
                        {item.icon}
                    </span>
                </span>

                <span className='ease-[cubic-bezier(0.83,0,0.17,1)] absolute left-0 right-0 top-full translate-y-0 whitespace-nowrap text-center text-base leading-[2] opacity-0 transition-[opacity,transform] duration-300 group-hover:opacity-100 group-hover:[transform:translateY(20%)]'>
                    {item.label}
                </span>
            </button>
        )

        if (item.url) {
            return (
                <Link
                    key={index}
                    href={item.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='!no-underline outline-none'
                >
                    {iconButton}
                </Link>
            )
        }

        return <div key={index}>{iconButton}</div>
    }

    return (
        <div
            className={`mx-auto grid overflow-visible py-[2em] ${
                className || 'grid-cols-2 gap-[5em] md:grid-cols-3'
            }`}
        >
            {items.map((item, index) => renderIcon(item, index))}
        </div>
    )
}

export default GlassIcons
