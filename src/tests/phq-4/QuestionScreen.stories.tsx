import React from 'react';
import { QuestionScreen } from '../../components/QuestionScreen';

export default {
    title: 'PHQ-4/QuestionScreen',
    component: QuestionScreen,
    parameters: {
        layout: 'fullscreen',
    },
};

const sampleQuestion = {
    id: 'q1',
    text: 'Feeling nervous, anxious, or on edge',
    options: [
        { value: 0, label: 'I did not feel nervous, anxious, or on edge at all.' },
        { value: 1, label: 'I felt nervous, anxious, or on edge on several days.' },
        { value: 2, label: 'I felt nervous, anxious, or on edge on more than half of the days.' },
        { value: 3, label: 'I felt nervous, anxious, or on edge nearly every day.' },
    ],
};

export const FirstQuestion = () => (
    <QuestionScreen
        question={sampleQuestion}
        questionNumber={1}
        totalQuestions={4}
        selectedValue={null}
        onAnswer={() => { }}
        onNext={() => { }}
        onPrevious={() => { }}
        isFirst={true}
        isLast={false}
        testTitle="PHQ-4 — Ultra-Brief Anxiety & Depression Screener"
    />
);

export const WithSelection = () => (
    <QuestionScreen
        question={sampleQuestion}
        questionNumber={1}
        totalQuestions={4}
        selectedValue={2}
        onAnswer={() => { }}
        onNext={() => { }}
        onPrevious={() => { }}
        isFirst={true}
        isLast={false}
        testTitle="PHQ-4 — Ultra-Brief Anxiety & Depression Screener"
    />
);

export const LastQuestion = () => (
    <QuestionScreen
        question={{
            id: 'q4',
            text: 'Feeling down, depressed, or hopeless',
            options: [
                { value: 0, label: 'I did not feel down, depressed, or hopeless at all.' },
                { value: 1, label: 'I felt down, depressed, or hopeless on several days.' },
                { value: 2, label: 'I felt down, depressed, or hopeless on more than half of the days.' },
                { value: 3, label: 'I felt down, depressed, or hopeless nearly every day.' },
            ],
        }}
        questionNumber={4}
        totalQuestions={4}
        selectedValue={1}
        onAnswer={() => { }}
        onNext={() => { }}
        onPrevious={() => { }}
        isFirst={false}
        isLast={true}
        testTitle="PHQ-4 — Ultra-Brief Anxiety & Depression Screener"
    />
);
