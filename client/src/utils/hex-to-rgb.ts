export type RGBColor = [number, number, number]

export function hexToRgb(hex: string): RGBColor {
    hex = hex.replace(/^#/, '')
    if (hex.length === 3) {
        hex = hex
            .split('')
            .map(c => c + c)
            .join('')
    }
    const int = parseInt(hex, 16)
    const r = ((int >> 16) & 255) / 255
    const g = ((int >> 8) & 255) / 255
    const b = (int & 255) / 255
    return [r, g, b]
}
