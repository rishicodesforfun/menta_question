import { computeScore } from '../../src/scoring/burnout';

describe('Burnout Scoring Module', () => {
    test('all_min: all 0s → High burnout (PA=0 reverse-interpreted)', () => {
        const r = computeScore(new Array(22).fill(0));
        // PA=0 is reverse-interpreted as High burnout (low PA = high burnout)
        expect(r.band).toBe('High burnout');
    });

    test('all_max: score 84 with high burnout', () => {
        const r = computeScore(new Array(22).fill(6));
        expect(r.subscaleScores?.emotional_exhaustion?.band).toBe('High');
        expect(r.subscaleScores?.depersonalization?.band).toBe('High');
        expect(r.band).toBe('High burnout');
    });

    test('PA reverse interpretation: low PA = high burnout', () => {
        // EE and DP low (0s), PA low (0s) → PA band should be "High burnout"
        const a = new Array(22).fill(0);
        const r = computeScore(a);
        expect(r.subscaleScores?.personal_accomplishment?.score).toBe(0);
        expect(r.subscaleScores?.personal_accomplishment?.band).toBe('High burnout');
    });

    test('PA high (48) = Low burnout', () => {
        const a = new Array(22).fill(0);
        for (let i = 14; i < 22; i++) a[i] = 6; // PA max
        const r = computeScore(a);
        expect(r.subscaleScores?.personal_accomplishment?.score).toBe(48);
        expect(r.subscaleScores?.personal_accomplishment?.band).toBe('Low burnout');
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0])).toThrow('requires exactly 22');
    });

    test('rejects out-of-range', () => {
        const a = new Array(22).fill(0); a[0] = 7;
        expect(() => computeScore(a)).toThrow('integer 0–6');
    });
});
