// hooks/use-linkedin-detection.ts
import { useEffect, useState } from 'react'

export const useLinkedInDetection = () => {
    const [isLinkedInApp, setIsLinkedInApp] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const detectLinkedInApp = () => {
            if (typeof window === 'undefined') return false
            
            const userAgent = window.navigator.userAgent.toLowerCase()
            
            //* More comprehensive LinkedIn detection patterns
            const linkedInPatterns = [
                'linkedin',
                'linkedinapp',
                'linkedin-app',
                'linkedinshareext'
            ]
            
            //* Additional checks for LinkedIn in-app browser
            const isLinkedIn = linkedInPatterns.some(pattern => userAgent.includes(pattern))
            
            //* You can also check for specific user agent patterns that LinkedIn uses
            const hasLinkedInUserAgent = /linkedin/i.test(userAgent)
            
            return isLinkedIn || hasLinkedInUserAgent
        }

        setIsLinkedInApp(detectLinkedInApp())
        setIsLoading(false)
    }, [])

    return { isLinkedInApp, isLoading }
}