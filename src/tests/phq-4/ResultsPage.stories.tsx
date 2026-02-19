import React from 'react';
import { GentleResultsPage as ResultsPage } from '../../components/GentleResultsPage';

export default {
    title: 'PHQ-4/ResultsPage',
    component: ResultsPage,
    parameters: {
        layout: 'fullscreen',
    },
};

const commonTestData = {
    scoring: { maxScore: 12 },
    non_diagnostic_disclaimer: "This screening result is not a diagnosis. It is intended to help identify areas where further support may be beneficial. Please consult a licensed mental health professional for a comprehensive evaluation."
};

export const NoneDistress = () => (
    <ResultsPage
        testId="phq-4"
        testTitle="PHQ-4 — Ultra-Brief Anxiety & Depression Screener"
        result={{
            totalScore: 1,
            band: 'None',
            subscaleScores: {
                Anxiety: { score: 1, band: 'Below threshold' },
                Depression: { score: 0, band: 'Below threshold' }
            },
            requiresEscalation: false,
            escalationReasons: [],
            rawAnswers: [0, 1, 0, 0]
        }}
        testData={{
            ...commonTestData,
            recommendedActions: {
                'None': ['Continue normal onboarding flow']
            }
        }}
        onRetake={() => { }}
        onHome={() => { }}
    />
);

export const MildDistress = () => (
    <ResultsPage
        testId="phq-4"
        testTitle="PHQ-4 — Ultra-Brief Anxiety & Depression Screener"
        result={{
            totalScore: 4,
            band: 'Mild',
            subscaleScores: {
                Anxiety: { score: 3, band: 'Above threshold' },
                Depression: { score: 1, band: 'Below threshold' }
            },
            requiresEscalation: false,
            escalationReasons: [],
            rawAnswers: [1, 2, 1, 0]
        }}
        testData={{
            ...commonTestData,
            recommendedActions: {
                'Mild': [
                    'Recommend full anxiety or depression screening',
                    'Launch GAD-7 assessment'
                ]
            }
        }}
        onRetake={() => { }}
        onHome={() => { }}
    />
);

export const SevereDistress = () => (
    <ResultsPage
        testId="phq-4"
        testTitle="PHQ-4 — Ultra-Brief Anxiety & Depression Screener"
        result={{
            totalScore: 11,
            band: 'Severe',
            subscaleScores: {
                Anxiety: { score: 6, band: 'Above threshold' },
                Depression: { score: 5, band: 'Above threshold' }
            },
            requiresEscalation: true,
            escalationReasons: ['High overall distress'],
            rawAnswers: [3, 3, 3, 2]
        }}
        testData={{
            ...commonTestData,
            recommendedActions: {
                'Severe': [
                    'Urgent comprehensive assessment recommended',
                    'Provide crisis resources',
                    'Launch GAD-7 assessment',
                    'Launch PHQ-9 assessment'
                ]
            }
        }}
        onRetake={() => { }}
        onHome={() => { }}
    />
);
