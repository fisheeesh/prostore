"use client"

import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

interface CookieManagerProps {
    className?: string;
}

export const CookieManager: React.FC<CookieManagerProps> = ({ className = '' }) => {
    const [hasConsent, setHasConsent] = useState<boolean>(false);
    const [showManager, setShowManager] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const consent = localStorage.getItem('cookie-consent');
            setHasConsent(!!consent);
        }
    }, []);

    const clearCookieConsent = (): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cookie-consent');
            window.location.reload();
        }
    };

    if (!hasConsent) return null;

    return (
        <>
            <button
                onClick={() => setShowManager(true)}
                className={`inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors ${className}`}
            >
                <Cookie className="w-4 h-4" />
                Cookie Settings
            </button>

            {showManager && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4">Manage Cookies</h3>
                        <p className="text-gray-600 mb-6">
                            You can change your cookie preferences or withdraw consent at any time.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowManager(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={clearCookieConsent}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Change Settings
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};