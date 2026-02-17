import { computeScore } from '../../src/scoring/who-5';

describe('WHO-5 Scoring Module', () => {
    test('all_max: raw 25, pct 100, Good', () => {
        const r = computeScore([5, 5, 5, 5, 5]);
        expect(r.totalScore).toBe(100);
        expect(r.band).toBe('Good well-being');
        expect(r.subscaleScores?.raw?.score).toBe(25);
    });

    test('all_min: raw 0, pct 0, Likely depression', () => {
        const r = computeScore([0, 0, 0, 0, 0]);
        expect(r.totalScore).toBe(0);
        expect(r.band).toBe('Likely depression');
        expect(r.escalationReasons[0]).toContain('WHO-5 ≤ 28%');
    });

    test('boundary Good/Low: pct 52→Good, pct 48→Low', () => {
        expect(computeScore([3, 3, 3, 2, 2]).band).toBe('Good well-being'); // raw 13 → 52
        expect(computeScore([3, 3, 3, 2, 1]).band).toBe('Low well-being'); // raw 12 → 48
    });

    test('boundary Low/Depression: pct 28→Likely, pct 32→Low', () => {
        expect(computeScore([2, 2, 2, 1, 0]).band).toBe('Likely depression'); // raw 7 → 28
        expect(computeScore([2, 2, 2, 1, 1]).band).toBe('Low well-being'); // raw 8 → 32
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0, 0, 0])).toThrow('requires exactly 5');
    });

    test('rejects out-of-range', () => {
        expect(() => computeScore([0, 0, 0, 0, 6])).toThrow('integer 0–5');
    });
});
