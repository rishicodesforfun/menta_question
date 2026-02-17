import { computeScore } from '../../src/scoring/isi';

describe('ISI Scoring Module', () => {
    test('all_min: score 0, No insomnia', () => {
        const r = computeScore([0, 0, 0, 0, 0, 0, 0]);
        expect(r.totalScore).toBe(0);
        expect(r.band).toBe('No clinically significant insomnia');
    });

    test('all_max: score 28, Severe', () => {
        const r = computeScore([4, 4, 4, 4, 4, 4, 4]);
        expect(r.totalScore).toBe(28);
        expect(r.band).toBe('Severe insomnia');
    });

    test('band boundaries', () => {
        expect(computeScore([1, 1, 1, 1, 1, 1, 1]).band).toBe('No clinically significant insomnia'); // 7
        expect(computeScore([2, 1, 1, 1, 1, 1, 1]).band).toBe('Subthreshold insomnia'); // 8
        expect(computeScore([2, 2, 2, 2, 2, 2, 2]).band).toBe('Subthreshold insomnia'); // 14
        expect(computeScore([3, 2, 2, 2, 2, 2, 2]).band).toBe('Moderate insomnia'); // 15
        expect(computeScore([3, 3, 3, 3, 3, 3, 3]).band).toBe('Moderate insomnia'); // 21
        expect(computeScore([4, 3, 3, 3, 3, 3, 3]).band).toBe('Severe insomnia'); // 22
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0, 0])).toThrow('requires exactly 7');
    });

    test('rejects out-of-range', () => {
        expect(() => computeScore([0, 0, 0, 0, 0, 0, 5])).toThrow('integer 0–4');
    });
});
