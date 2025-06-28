"use client";

import { useCookieConsent } from '@/lib/cookies';
import React, { useEffect } from 'react';

const Analytics: React.FC = () => {
    const { hasAnalytics } = useCookieConsent();

    useEffect(() => {
        if (hasAnalytics) {
            // Initialize analytics
            console.log('Analytics initialized');
        }
    }, [hasAnalytics]);

    return null;
};

export default Analytics;