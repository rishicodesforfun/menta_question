import React, { useState, useCallback } from 'react';
import { LandingPage } from './components/LandingPage';
import { GuidedSelector } from './components/GuidedSelector';
import { TestBrowser } from './components/TestBrowser';
import { GenericTestRunner } from './components/GenericTestRunner';

type Screen =
    | { type: 'landing' }
    | { type: 'guided' }
    | { type: 'browse' }
    | { type: 'test'; testId: string; from: 'guided' | 'browse' };

function App() {
    const [screen, setScreen] = useState<Screen>({ type: 'landing' });

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

    switch (screen.type) {
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
