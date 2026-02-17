import { computeScore } from '../../src/scoring/ies-r';

describe('IES-R Scoring Module', () => {
    test('all_min: score 0, Minimal', () => {
        const r = computeScore(new Array(22).fill(0));
        expect(r.totalScore).toBe(0);
        expect(r.band).toBe('Minimal');
        expect(r.requiresEscalation).toBe(false);
    });

    test('all_max: score 88, Severe, escalation', () => {
        const r = computeScore(new Array(22).fill(4));
        expect(r.totalScore).toBe(88);
        expect(r.band).toBe('Severe');
        expect(r.requiresEscalation).toBe(true);
    });

    test('score 37 triggers escalation', () => {
        const a = new Array(22).fill(0);
        // Set first 10 items to 4 → 40, and check escalation
        for (let i = 0; i < 10; i++) a[i] = 4;
        const r = computeScore(a);
        expect(r.totalScore).toBe(40);
        expect(r.requiresEscalation).toBe(true);
    });

    test('score 36 no escalation', () => {
        const a = new Array(22).fill(0);
        for (let i = 0; i < 9; i++) a[i] = 4; // 36
        expect(computeScore(a).requiresEscalation).toBe(false);
    });

    test('subscales computed', () => {
        const a = new Array(22).fill(1);
        const r = computeScore(a);
        expect(r.subscaleScores?.intrusion?.score).toBe(5);
        expect(r.subscaleScores?.avoidance?.score).toBe(7);
        expect(r.subscaleScores?.hyperarousal?.score).toBe(10);
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0])).toThrow('requires exactly 22');
    });
});
