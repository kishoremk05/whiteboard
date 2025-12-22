import { useState, useEffect, useCallback } from 'react';

const ONBOARDING_STORAGE_KEY = 'ai-whiteboard-onboarded';

export function useOnboarding() {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user has completed onboarding
    useEffect(() => {
        // Onboarding is disabled - always mark as completed
        localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
        setShowOnboarding(false);
        setIsLoading(false);
    }, []);

    // Mark onboarding as complete
    const completeOnboarding = useCallback(() => {
        localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
        setShowOnboarding(false);
    }, []);

    // Reset onboarding (for testing/development)
    const resetOnboarding = useCallback(() => {
        localStorage.removeItem(ONBOARDING_STORAGE_KEY);
        setShowOnboarding(true);
    }, []);

    return {
        showOnboarding,
        isLoading,
        completeOnboarding,
        resetOnboarding,
    };
}
