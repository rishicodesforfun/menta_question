import { computeScore } from '../../src/scoring/pss-10';

describe('PSS-10 Scoring Module', () => {
    test('all_min: all 0s → score 16 (reverse items become 4)', () => {
        const r = computeScore([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        // Items 3,4,6,7 (0-indexed) reversed: 4-0=4, so 6*0 + 4*4 = 16
        expect(r.totalScore).toBe(16);
    });

    test('all_max: all 4s → score 24 (reverse items become 0)', () => {
        const r = computeScore([4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
        // Normal: 6*4=24, Reverse: 4*(4-4)=0, total=24
        expect(r.totalScore).toBe(24);
    });

    test('Low stress', () => {
        expect(computeScore([0, 0, 0, 4, 4, 0, 4, 4, 0, 0]).band).toBe('Low stress'); // 0+0+0+0+0+0+0+0+0+0=0
    });

    test('High stress with all max normal, all min reverse', () => {
        const r = computeScore([4, 4, 4, 0, 0, 4, 0, 0, 4, 4]);
        expect(r.totalScore).toBe(40);
        expect(r.band).toBe('High stress');
    });

    test('reverse scoring: Q4=4 becomes 0, Q4=0 becomes 4', () => {
        const base = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        // Only change Q4 (index 3)
        base[3] = 4; // reverse: 4-4=0
        const r1 = computeScore([...base]);
        base[3] = 0; // reverse: 4-0=4
        const r2 = computeScore([...base]);
        expect(r2.totalScore - r1.totalScore).toBe(4);
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0, 0])).toThrow('requires exactly 10');
    });

    test('rejects out-of-range', () => {
        expect(() => computeScore([0, 0, 0, 0, 0, 0, 0, 0, 0, 5])).toThrow('integer 0–4');
    });
});
