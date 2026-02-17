import { computeScore } from '../../src/scoring/mood-mdq';

describe('Mood MDQ Scoring Module', () => {
    test('all No: negative screen', () => {
        const r = computeScore(new Array(15).fill(0));
        expect(r.band).toBe('Negative screen');
    });

    test('positive screen: ≥7 Yes + clustering + impact ≥2', () => {
        const a = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2]; // 7 Yes, clustering, moderate impact
        const r = computeScore(a);
        expect(r.band).toBe('Positive screen');
    });

    test('negative: 7 Yes but no clustering', () => {
        const a = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2];
        expect(computeScore(a).band).toBe('Negative screen');
    });

    test('negative: 7 Yes + clustering but low impact', () => {
        const a = [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1];
        expect(computeScore(a).band).toBe('Negative screen');
    });

    test('negative: 6 Yes + clustering + high impact', () => {
        const a = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 3];
        expect(computeScore(a).band).toBe('Negative screen');
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0])).toThrow('requires exactly 15');
    });

    test('rejects Q15 out of range', () => {
        const a = new Array(15).fill(0); a[14] = 4;
        expect(() => computeScore(a)).toThrow('integer 0–3');
    });
});
