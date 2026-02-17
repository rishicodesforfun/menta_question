import { computeScore } from '../../src/scoring/personality-bfi10';

describe('Personality BFI-10 Scoring Module', () => {
    test('all neutral (3s): each trait = 3 + (6-3) = 6', () => {
        const r = computeScore(new Array(10).fill(3));
        expect(r.subscaleScores?.openness?.score).toBe(6);
        expect(r.subscaleScores?.extraversion?.score).toBe(6);
        expect(r.subscaleScores?.conscientiousness?.score).toBe(6);
        expect(r.subscaleScores?.agreeableness?.score).toBe(6);
        expect(r.subscaleScores?.neuroticism?.score).toBe(6);
    });

    test('all agree (5s): non-reverse=5, reverse=6-5=1 → trait=6', () => {
        const r = computeScore(new Array(10).fill(5));
        expect(r.subscaleScores?.openness?.score).toBe(6); // 5 + 1
    });

    test('max openness: Q1=5, Q6=1 → 5 + (6-1)=10', () => {
        const a = [5, 3, 3, 3, 3, 1, 3, 3, 3, 3]; // Q1=5 (non-rev), Q6=1 (rev→5)
        expect(computeScore(a).subscaleScores?.openness?.score).toBe(10);
    });

    test('no total band', () => {
        expect(computeScore(new Array(10).fill(3)).band).toBe('N/A');
    });

    test('rejects 0 (scale is 1-5)', () => {
        const a = new Array(10).fill(1); a[0] = 0;
        expect(() => computeScore(a)).toThrow('integer 1–5');
    });
});
