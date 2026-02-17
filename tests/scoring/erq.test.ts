import { computeScore } from '../../src/scoring/erq';

describe('ERQ Scoring Module', () => {
    test('all 1s: reappraisal avg=1, suppression avg=1', () => {
        const r = computeScore(new Array(10).fill(1));
        expect(r.subscaleScores?.cognitive_reappraisal?.score).toBe(1);
        expect(r.subscaleScores?.expressive_suppression?.score).toBe(1);
    });

    test('all 7s: reappraisal avg=7, suppression avg=7', () => {
        const r = computeScore(new Array(10).fill(7));
        expect(r.subscaleScores?.cognitive_reappraisal?.score).toBe(7);
        expect(r.subscaleScores?.expressive_suppression?.score).toBe(7);
    });

    test('no total band', () => {
        const r = computeScore(new Array(10).fill(4));
        expect(r.band).toBe('N/A');
        expect(r.totalScore).toBe(0);
    });

    test('rejects out-of-range (0)', () => {
        const a = new Array(10).fill(1); a[0] = 0;
        expect(() => computeScore(a)).toThrow('integer 1–7');
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([1])).toThrow('requires exactly 10');
    });
});
