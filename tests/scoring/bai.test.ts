import { computeScore } from '../../src/scoring/bai';

describe('BAI Scoring Module', () => {
    test('all_min: score 0, Minimal', () => {
        const r = computeScore(new Array(21).fill(0));
        expect(r.totalScore).toBe(0);
        expect(r.band).toBe('Minimal');
    });

    test('all_max: score 63, Severe', () => {
        const r = computeScore(new Array(21).fill(3));
        expect(r.totalScore).toBe(63);
        expect(r.band).toBe('Severe');
    });

    test('band boundaries', () => {
        // 7 → Minimal, 8 → Mild
        const a7 = new Array(21).fill(0); a7[0] = 3; a7[1] = 3; a7[2] = 1;
        expect(computeScore(a7).band).toBe('Minimal');
        const a8 = new Array(21).fill(0); a8[0] = 3; a8[1] = 3; a8[2] = 2;
        expect(computeScore(a8).band).toBe('Mild');
    });

    test('no escalation', () => {
        expect(computeScore(new Array(21).fill(3)).requiresEscalation).toBe(false);
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0, 0])).toThrow('requires exactly 21');
    });
});
