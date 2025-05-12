export function parseReleaseDate(dateStr: string | undefined): Date | null {
    if (!dateStr) return null

    const timestamp = Number(dateStr)
    if (!isNaN(timestamp)) {
        return new Date(timestamp)
    }

    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? null : date
}
