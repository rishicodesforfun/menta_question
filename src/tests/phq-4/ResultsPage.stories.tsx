import React from 'react';
import { ResultsPage } from '../components/ResultsPage';

export default {
    title: 'PHQ-4/ResultsPage',
    component: ResultsPage,
    parameters: {
        layout: 'fullscreen',
    },
};

export const NoneDistress = () => (
    <ResultsPage
        testTitle="PHQ-4 — Ultra-Brief Anxiety & Depression Screener"
        totalScore={1}
        maxScore={12}
        band={{ label: 'None', description: 'No significant distress detected' }}
        subscales={[
            { label: 'Anxiety', score: 1, maxScore: 6, band: 'Below threshold' },
            { label: 'Depression', score: 0, maxScore: 6, band: 'Below threshold' },
        ]}
        recommendedActions={['Continue normal onboarding flow']}
        disclaimer="This screening result is not a diagnosis. It is intended to help identify areas where further support may be beneficial. Please consult a licensed mental health professional for a comprehensive evaluation."
        onRetake={() => { }}
        onClose={() => { }}
    />
);

export const MildDistress = () => (
    <ResultsPage
        testTitle="PHQ-4 — Ultra-Brief Anxiety & Depression Screener"
        totalScore={4}
        maxScore={12}
        band={{ label: 'Mild', description: 'Mild distress level' }}
        subscales={[
            { label: 'Anxiety', score: 3, maxScore: 6, band: 'Above threshold' },
            { label: 'Depression', score: 1, maxScore: 6, band: 'Below threshold' },
        ]}
        recommendedActions={[
            'Recommend full anxiety or depression screening',
            'Launch GAD-7 assessment',
        ]}
        disclaimer="This screening result is not a diagnosis. It is intended to help identify areas where further support may be beneficial. Please consult a licensed mental health professional for a comprehensive evaluation."
        onRetake={() => { }}
        onClose={() => { }}
    />
);

export const SevereDistress = () => (
    <ResultsPage
        testTitle="PHQ-4 — Ultra-Brief Anxiety & Depression Screener"
        totalScore={11}
        maxScore={12}
        band={{ label: 'Severe', description: 'Severe distress level' }}
        subscales={[
            { label: 'Anxiety', score: 6, maxScore: 6, band: 'Above threshold' },
            { label: 'Depression', score: 5, maxScore: 6, band: 'Above threshold' },
        ]}
        recommendedActions={[
            'Urgent comprehensive assessment recommended',
            'Provide crisis resources',
            'Launch GAD-7 assessment',
            'Launch PHQ-9 assessment',
        ]}
        disclaimer="This screening result is not a diagnosis. It is intended to help identify areas where further support may be beneficial. Please consult a licensed mental health professional for a comprehensive evaluation."
        onRetake={() => { }}
        onClose={() => { }}
    />
);
