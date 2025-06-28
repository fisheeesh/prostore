
import { CookieConsentData, CookiePreferences } from '@/types/cookies';
import React from 'react';

export const getCookieConsent = (): CookieConsentData | null => {
    if (typeof window === 'undefined') return null;

    try {
        const consent = localStorage.getItem('cookie-consent');
        return consent ? JSON.parse(consent) : null;
    } catch (error) {
        console.error('Error parsing cookie consent:', error);
        return null;
    }
};

export const getCookiePreferences = (): CookiePreferences | null => {
    const consent = getCookieConsent();
    return consent?.preferences || null;
};

export const hasAnalyticsConsent = (): boolean => {
    const preferences = getCookiePreferences();
    return preferences?.analytics || false;
};

export const hasMarketingConsent = (): boolean => {
    const preferences = getCookiePreferences();
    return preferences?.marketing || false;
};

export const hasFunctionalConsent = (): boolean => {
    const preferences = getCookiePreferences();
    return preferences?.functional || false;
};

export const hasNecessaryConsent = (): boolean => {
    const preferences = getCookiePreferences();
    return preferences?.necessary || false;
};

// Custom hook for cookie consent
export const useCookieConsent = () => {
    const [consent, setConsent] = React.useState<CookieConsentData | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        const consentData = getCookieConsent();
        setConsent(consentData);
        setLoading(false);
    }, []);

    return {
        consent,
        preferences: consent?.preferences || null,
        hasConsent: !!consent,
        loading,
        hasAnalytics: hasAnalyticsConsent(),
        hasMarketing: hasMarketingConsent(),
        hasFunctional: hasFunctionalConsent(),
    };
};