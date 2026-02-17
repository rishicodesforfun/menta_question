import { computeScore } from '../../src/scoring/rses';

describe('RSES Scoring Module', () => {
    test('all_min (0s): reversed items give 3 each → 5*3=15', () => {
        const r = computeScore(new Array(10).fill(0));
        // Non-reverse (0,1,3): 0*5=0, Reverse (2,4,7,8,9): 3*5=15
        expect(r.totalScore).toBe(15);
        expect(r.band).toBe('Normal self-esteem');
    });

    test('all_max (3s): non-reverse=3*5=15, reverse=0*5=0 → 15', () => {
        const r = computeScore(new Array(10).fill(3));
        expect(r.totalScore).toBe(15);
    });

    test('highest self-esteem: non-reverse=3, reverse=0', () => {
        const a = [3, 3, 0, 3, 0, 3, 3, 0, 0, 0]; // non-reverse max, reverse items 0→3
        const r = computeScore(a);
        expect(r.totalScore).toBe(30);
        expect(r.band).toBe('High self-esteem');
    });

    test('lowest self-esteem: non-reverse=0, reverse=3', () => {
        const a = [0, 0, 3, 0, 3, 0, 0, 3, 3, 3]; // non-reverse 0, reverse 3→0
        const r = computeScore(a);
        expect(r.totalScore).toBe(0);
        expect(r.band).toBe('Low self-esteem');
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0])).toThrow('requires exactly 10');
    });
});
