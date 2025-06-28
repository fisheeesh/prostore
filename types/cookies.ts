export interface CookiePreferences {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
}

export interface CookieConsentData {
    preferences: CookiePreferences;
    timestamp: string;
    version: string;
}