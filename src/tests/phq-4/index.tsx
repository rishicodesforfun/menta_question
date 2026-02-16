import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { QuestionScreen } from '../../components/QuestionScreen';
import { ProgressBar } from '../../components/ProgressBar';
import { ResultsPage } from '../../components/ResultsPage';
import { useAutosave } from '../../hooks/useAutosave';
import { computeScore, PHQ4Result } from '../../scoring/phq-4';
import phq4Data from '../../../tests_json/phq-4.json';

type ScreenState = 'intro' | 'questions' | 'results';

export const PHQ4Test: React.FC = () => {
    const [screen, setScreen] = useState<ScreenState>('intro');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(
        new Array(phq4Data.questions.length).fill(null)
    );
    const [result, setResult] = useState<PHQ4Result | null>(null);

    const { save, load, clear } = useAutosave();

    // Load saved session on mount
    useEffect(() => {
        const saved = load('phq-4');
        if (saved) {
            setAnswers(saved.answers);
            setCurrentIndex(saved.currentIndex);
            if (saved.answers.some((a) => a !== null)) {
                setScreen('questions');
            }
        }
    }, [load]);

    // Save on every answer change
    useEffect(() => {
        if (screen === 'questions') {
            save({
                testId: 'phq-4',
                answers,
                currentIndex,
                startedAt: new Date().toISOString(),
            });
        }
    }, [answers, currentIndex, screen, save]);

    const currentQuestion = useMemo(
        () => phq4Data.questions[currentIndex],
        [currentIndex]
    );

    const handleAnswer = useCallback((value: number) => {
        setAnswers((prev) => {
            const next = [...prev];
            next[currentIndex] = value;
            return next;
        });
    }, [currentIndex]);

    const handleNext = useCallback(() => {
        if (currentIndex < phq4Data.questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            // Submit — compute score
            const numericAnswers = answers as number[];
            const scoreResult = computeScore(numericAnswers);
            setResult(scoreResult);
            setScreen('results');
            clear('phq-4');
        }
    }, [currentIndex, answers, clear]);

    const handlePrevious = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    }, [currentIndex]);

    const handleRetake = useCallback(() => {
        setAnswers(new Array(phq4Data.questions.length).fill(null));
        setCurrentIndex(0);
        setResult(null);
        setScreen('intro');
    }, []);

    // ─── Intro Screen ────────────────────────
    if (screen === 'intro') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-mentamind-50 via-white to-emerald-50 flex flex-col items-center justify-center px-6">
                <div className="max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-mentamind-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-mentamind-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">
                        {phq4Data.title}
                    </h1>
                    <p className="text-gray-500 mb-2 text-sm">
                        {phq4Data.timeframe} • {phq4Data.questions.length} questions
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-8">
                        {phq4Data.instruction}
                    </p>

                    {/* Safety notes */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-left">
                        <p className="text-sm text-amber-800">
                            {phq4Data.non_diagnostic_disclaimer}
                        </p>
                    </div>

                    <button
                        onClick={() => setScreen('questions')}
                        className="w-full px-6 py-4 rounded-xl font-semibold text-white text-lg
                       bg-mentamind-600 hover:bg-mentamind-700 shadow-lg shadow-mentamind-200
                       transition-all focus:outline-none focus:ring-4 focus:ring-mentamind-200 min-h-[56px]"
                        autoFocus
                    >
                        Begin Screening
                    </button>
                </div>
            </div>
        );
    }

    // ─── Questions Screen ─────────────────────
    if (screen === 'questions' && currentQuestion) {
        return (
            <div>
                <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-3">
                    <ProgressBar
                        current={currentIndex + 1}
                        total={phq4Data.questions.length}
                        testTitle={phq4Data.title}
                    />
                </div>
                <div className="pt-16">
                    <QuestionScreen
                        question={currentQuestion}
                        questionNumber={currentIndex + 1}
                        totalQuestions={phq4Data.questions.length}
                        selectedValue={answers[currentIndex]}
                        onAnswer={handleAnswer}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        isFirst={currentIndex === 0}
                        isLast={currentIndex === phq4Data.questions.length - 1}
                        testTitle={phq4Data.title}
                    />
                </div>
            </div>
        );
    }

    // ─── Results Screen ───────────────────────
    if (screen === 'results' && result) {
        const band = phq4Data.scoring.bands.find((b) => b.label === result.band);
        const bandKey = result.band.toLowerCase() as keyof typeof phq4Data.recommended_actions;
        const actions = phq4Data.recommended_actions[bandKey] || [];

        // Add subscale-specific actions
        const allActions = [...actions];
        if (result.subscaleScores.anxiety.band === 'Above threshold') {
            allActions.push(...(phq4Data.recommended_actions.anxiety_flagged || []));
        }
        if (result.subscaleScores.depression.band === 'Above threshold') {
            allActions.push(...(phq4Data.recommended_actions.depression_flagged || []));
        }

        return (
            <ResultsPage
                testTitle={phq4Data.title}
                totalScore={result.totalScore}
                maxScore={12}
                band={{
                    label: result.band,
                    description: result.bandDescription,
                    action: band?.action,
                }}
                subscales={[
                    {
                        label: 'Anxiety',
                        score: result.subscaleScores.anxiety.score,
                        maxScore: 6,
                        band: result.subscaleScores.anxiety.band,
                    },
                    {
                        label: 'Depression',
                        score: result.subscaleScores.depression.score,
                        maxScore: 6,
                        band: result.subscaleScores.depression.band,
                    },
                ]}
                recommendedActions={allActions}
                disclaimer={phq4Data.non_diagnostic_disclaimer}
                onRetake={handleRetake}
                onClose={() => window.close()}
            />
        );
    }

    return null;
};

export default PHQ4Test;
