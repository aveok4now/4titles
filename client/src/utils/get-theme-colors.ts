export function getThemeColors(): string[] {
    const bodyStyles = getComputedStyle(document.body)
    const primaryColor = bodyStyles.getPropertyValue('--primary').trim()
    const secondaryColor = bodyStyles.getPropertyValue('--secondary').trim()
    const accentColor = bodyStyles.getPropertyValue('--accent').trim()

    const toHex = (cssVar: string) => {
        if (cssVar.startsWith('#')) return cssVar

        const [h, s, l] = cssVar
            .split(' ')
            .map(val => parseFloat(val.replace('%', '')))

        const toRGB = (h: number, s: number, l: number) => {
            s /= 100
            l /= 100
            const a = s * Math.min(l, 1 - l)
            const f = (n: number) => {
                const k = (n + h / 30) % 12
                const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
                return Math.round(255 * color)
                    .toString(16)
                    .padStart(2, '0')
            }
            return `#${f(0)}${f(8)}${f(4)}`
        }

        return toRGB(h, s, l)
    }

    return [toHex(primaryColor), toHex(secondaryColor), toHex(accentColor)]
}
