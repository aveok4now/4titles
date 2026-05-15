export const BASE_COLORS = [
    {
        name: 'lavender',
        color: '237 98% 80%',
    },
    {
        name: 'violet',
        color: '262.1 83.3% 57.8%',
    },
    {
        name: 'blue',
        color: '217 91% 60%',
    },
    {
        name: 'cyan',
        color: '183 100% 42%',
    },
    {
        name: 'green',
        color: '158 64% 52%',
    },
    {
        name: 'orange',
        color: '24 94% 50%',
    },
    {
        name: 'red',
        color: '358 92% 66%',
    },
    {
        name: 'pink',
        color: '327 87% 62%',
    },
] as const

export type BaseColorType = (typeof BASE_COLORS)[number]['name']
