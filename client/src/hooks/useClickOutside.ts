import { RefObject, useEffect } from 'react'

function useClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    callback: () => void,
    excludeRefs: RefObject<HTMLElement>[] = [],
): void {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent): void {
            if (!ref.current || !event.target) return

            const targetElement = event.target as Node

            const clickedOnExcludedElement = excludeRefs.some(
                excludeRef =>
                    excludeRef.current &&
                    excludeRef.current.contains(targetElement),
            )

            if (
                !ref.current.contains(targetElement) &&
                !clickedOnExcludedElement
            ) {
                callback()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [ref, callback, excludeRefs])
}

export default useClickOutside
