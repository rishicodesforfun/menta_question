import { computeScore } from '../../src/scoring/gad-7';

describe('GAD-7 Scoring Module', () => {
    test('all_min: score 0, Minimal', () => {
        const r = computeScore([0, 0, 0, 0, 0, 0, 0]);
        expect(r.totalScore).toBe(0);
        expect(r.band).toBe('Minimal');
        expect(r.requiresEscalation).toBe(false);
    });

    test('all_max: score 21, Severe', () => {
        const r = computeScore([3, 3, 3, 3, 3, 3, 3]);
        expect(r.totalScore).toBe(21);
        expect(r.band).toBe('Severe');
    });

    test('boundary Minimal/Mild: 4→Minimal, 5→Mild', () => {
        expect(computeScore([2, 2, 0, 0, 0, 0, 0]).band).toBe('Minimal');
        expect(computeScore([2, 2, 1, 0, 0, 0, 0]).band).toBe('Mild');
    });

    test('boundary Mild/Moderate: 9→Mild, 10→Moderate', () => {
        expect(computeScore([2, 2, 2, 2, 1, 0, 0]).band).toBe('Mild');
        expect(computeScore([2, 2, 2, 2, 2, 0, 0]).band).toBe('Moderate');
    });

    test('boundary Moderate/Severe: 14→Moderate, 15→Severe', () => {
        expect(computeScore([2, 2, 2, 2, 2, 2, 2]).band).toBe('Moderate');
        expect(computeScore([3, 2, 2, 2, 2, 2, 2]).band).toBe('Severe');
    });

    test('clinical flag at ≥10', () => {
        const r = computeScore([2, 2, 2, 2, 2, 0, 0]);
        expect(r.escalationReasons.length).toBe(1);
        expect(r.escalationReasons[0]).toContain('GAD-7 ≥ 10');
    });

    test('no flag below 10', () => {
        expect(computeScore([1, 1, 1, 1, 1, 1, 1]).escalationReasons).toHaveLength(0);
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0, 0, 0])).toThrow('requires exactly 7');
    });

    test('rejects out-of-range', () => {
        expect(() => computeScore([0, 0, 0, 0, 0, 0, 4])).toThrow('integer 0–3');
    });

    test('raw answers immutable', () => {
        const input = [1, 2, 0, 3, 1, 0, 2];
        const r = computeScore(input);
        input[0] = 99;
        expect(r.rawAnswers[0]).toBe(1);
    });
});
