import React, { useState, useCallback, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { GuidedSelector } from './components/GuidedSelector';
import { TestBrowser } from './components/TestBrowser';
import { GenericTestRunner } from './components/GenericTestRunner';
import { PrivacyConsent } from './components/PrivacyConsent';

const CONSENT_KEY = 'mentamind_consent_accepted';

type Screen =
    | { type: 'consent' }
    | { type: 'landing' }
    | { type: 'guided' }
    | { type: 'browse' }
    | { type: 'test'; testId: string; from: 'guided' | 'browse' };

function App() {
    const [screen, setScreen] = useState<Screen>(() => {
        // Check if user has already accepted consent
        try {
            if (localStorage.getItem(CONSENT_KEY)) {
                return { type: 'landing' };
            }
        } catch { /* noop */ }
        return { type: 'consent' };
    });

    const goLanding = useCallback(() => setScreen({ type: 'landing' }), []);
    const goGuided = useCallback(() => setScreen({ type: 'guided' }), []);
    const goBrowse = useCallback(() => setScreen({ type: 'browse' }), []);

    const goTest = useCallback((testId: string, from: 'guided' | 'browse' = 'guided') => {
        setScreen({ type: 'test', testId, from });
    }, []);

    const goBackFromTest = useCallback(() => {
        if (screen.type === 'test') {
            setScreen({ type: screen.from === 'browse' ? 'browse' : 'guided' });
        } else {
            goLanding();
        }
    }, [screen, goLanding]);

    const handleConsent = useCallback(() => {
        try {
            localStorage.setItem(CONSENT_KEY, new Date().toISOString());
        } catch { /* noop */ }
        setScreen({ type: 'landing' });
    }, []);

    // Scroll to top on screen change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [screen]);

    switch (screen.type) {
        case 'consent':
            return <PrivacyConsent onAccept={handleConsent} />;

        case 'landing':
            return <LandingPage onStart={goGuided} onBrowseAll={goBrowse} />;

        case 'guided':
            return (
                <GuidedSelector
                    onSelectTest={(id) => goTest(id, 'guided')}
                    onBrowseAll={goBrowse}
                    onBack={goLanding}
                />
            );

        case 'browse':
            return (
                <TestBrowser
                    onSelectTest={(id) => goTest(id, 'browse')}
                    onBack={goLanding}
                />
            );

        case 'test':
            return (
                <GenericTestRunner
                    testId={screen.testId}
                    onBack={goBackFromTest}
                    onHome={goLanding}
                />
            );

        default:
            return <LandingPage onStart={goGuided} onBrowseAll={goBrowse} />;
    }
}

export default App;
