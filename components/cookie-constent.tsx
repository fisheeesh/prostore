"use client"

import { CookieConsentData, CookiePreferences } from '@/types/cookies';
import { Cookie, Shield, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const COOKIE_CONSENT_VERSION = '1.0';

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
        fbq?: (...args: any[]) => void;
        _fbq?: any;
    }
}

const CookieConsent: React.FC = () => {
    const [showBanner, setShowBanner] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>({
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false,
    });

    useEffect(() => {
        checkCookieConsent();
    }, []);

    const checkCookieConsent = (): void => {
        if (typeof window === 'undefined') return;

        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setShowBanner(true);
        } else {
            try {
                const consentData: CookieConsentData = JSON.parse(consent);
                setCookiePreferences(consentData.preferences);
                loadScripts(consentData.preferences);
            } catch (error) {
                console.error('Error parsing cookie consent:', error);
                setShowBanner(true);
            }
        }
    };

    const handleAcceptAll = (): void => {
        const allAccepted: CookiePreferences = {
            necessary: true,
            analytics: true,
            marketing: true,
            functional: true,
        };

        saveCookiePreferences(allAccepted);
        loadScripts(allAccepted);
        setShowBanner(false);
    };

    const handleRejectAll = (): void => {
        const onlyNecessary: CookiePreferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false,
        };

        saveCookiePreferences(onlyNecessary);
        loadScripts(onlyNecessary);
        setShowBanner(false);
    };

    const handleSavePreferences = (): void => {
        saveCookiePreferences(cookiePreferences);
        loadScripts(cookiePreferences);
        setShowBanner(false);
        setShowSettings(false);
    };

    const saveCookiePreferences = (preferences: CookiePreferences): void => {
        if (typeof window === 'undefined') return;

        const consentData: CookieConsentData = {
            preferences,
            timestamp: new Date().toISOString(),
            version: COOKIE_CONSENT_VERSION,
        };

        localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    };

    const loadScripts = (preferences: CookiePreferences): void => {
        if (preferences.analytics) {
            loadGoogleAnalytics();
        }

        if (preferences.marketing) {
            loadFacebookPixel();
        }

        if (preferences.functional) {
            loadFunctionalScripts();
        }
    };

    const loadGoogleAnalytics = (): void => {
        if (typeof window !== 'undefined' && !window.gtag) {
            const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'GA_MEASUREMENT_ID';

            const script1 = document.createElement('script');
            script1.async = true;
            script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
            document.head.appendChild(script1);

            const script2 = document.createElement('script');
            script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}');
        `;
            document.head.appendChild(script2);
        }
    };

    const loadFacebookPixel = (): void => {
        if (typeof window !== 'undefined' && !window.fbq) {
            const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || 'YOUR_PIXEL_ID';

            const script = document.createElement('script');
            script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${PIXEL_ID}');
        fbq('track', 'PageView');
        `;
            document.head.appendChild(script);
        }
    };

    const loadFunctionalScripts = (): void => {
        // Load other functional scripts like chat widgets, etc.
        console.log('Loading functional scripts...');
    };

    const togglePreference = (type: keyof CookiePreferences): void => {
        if (type === 'necessary') return;

        setCookiePreferences(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    if (!showBanner) return null;

    return (
        <>
            {/* Cookie Banner */}
            {!showSettings && (
                <div className="fixed bottom-4 left-5 lg:left-[70px] z-50 w-[350px] md:w-[400px]">
                    <Card className="shadow-xl">
                        <div className="flex items-start justify-between p-4 pb-0">
                            <div className="flex items-center gap-2">
                                <Cookie className="w-5 h-5 text-amber-600" />
                                <h3 className="text-sm font-semibold">Cookie Settings</h3>
                            </div>
                            <button onClick={() => setShowBanner(false)} className="hover:bg-muted rounded-md p-1">
                                <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="px-4 pt-2 text-sm text-muted-foreground">
                            By clicking <strong>“Accept All”</strong>, you agree to the storing of cookies on your device to enhance site navigation, analyze site usage and assist in our marketing efforts
                        </div>

                        <div className="flex gap-2 px-4 py-4">
                            <Button
                                onClick={handleAcceptAll}

                            >
                                Accept All
                            </Button>
                            <Button
                                onClick={() => setShowSettings(true)}
                                variant="outline"
                            >
                                Cookie Settings
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Cookie Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-lg">
                        <div className="p-6 border-b flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                <h2 className="text-xl font-semibold">Cookie Preferences</h2>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="p-6 space-y-6 text-sm text-muted-foreground">
                            <p>
                                Choose which cookies you want to accept. You can change these settings at any time.
                            </p>

                            {[
                                {
                                    key: 'necessary' as const,
                                    title: 'Necessary Cookies',
                                    description:
                                        'These cookies are essential for the website to function properly. They cannot be disabled.',
                                    disabled: true,
                                },
                                {
                                    key: 'analytics' as const,
                                    title: 'Analytics Cookies',
                                    description:
                                        'Help us understand how visitors interact with our website by collecting anonymous information.',
                                    disabled: false,
                                },
                                {
                                    key: 'marketing' as const,
                                    title: 'Marketing Cookies',
                                    description:
                                        'Used to track visitors across websites to display relevant advertisements.',
                                    disabled: false,
                                },
                                {
                                    key: 'functional' as const,
                                    title: 'Functional Cookies',
                                    description:
                                        'Enable enhanced functionality and personalization, such as videos and live chat.',
                                    disabled: false,
                                },
                            ].map(({ key, title, description, disabled }) => (
                                <div
                                    key={key}
                                    className="flex items-start justify-between rounded-md border p-4"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-medium text-foreground mb-1">{title}</h3>
                                        <p className="text-sm">{description}</p>
                                    </div>
                                    <div className="ml-4">
                                        <button
                                            onClick={() => !disabled && togglePreference(key)}
                                            disabled={disabled}
                                            className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${cookiePreferences[key]
                                                    ? disabled
                                                        ? 'bg-green-500'
                                                        : 'bg-blue-600'
                                                    : 'bg-gray-300 dark:bg-gray-600'
                                                } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <div
                                                className={`w-4 h-4 bg-white rounded-full transition-transform ${cookiePreferences[key] ? 'translate-x-6' : 'translate-x-0'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-t flex justify-end gap-3">
                            <Button variant="outline" onClick={handleRejectAll}>
                                Reject All
                            </Button>
                            <Button onClick={handleSavePreferences}>Save Preferences</Button>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
};

export default CookieConsent;