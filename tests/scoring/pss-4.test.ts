import { computeScore } from '../../src/scoring/pss-4';

describe('PSS-4 Scoring Module', () => {
    test('all zeros → score 8 (reverse items become 4)', () => {
        // Q2,Q3 reversed: 4-0=4 each → 0+4+4+0=8
        expect(computeScore([0, 0, 0, 0]).totalScore).toBe(8);
    });

    test('max stress: [4,0,0,4] → 4+4+4+4=16', () => {
        const r = computeScore([4, 0, 0, 4]);
        expect(r.totalScore).toBe(16);
        expect(r.band).toBe('High stress');
    });

    test('min stress: [0,4,4,0] → 0+0+0+0=0', () => {
        const r = computeScore([0, 4, 4, 0]);
        expect(r.totalScore).toBe(0);
        expect(r.band).toBe('Low stress');
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0])).toThrow('requires exactly 4');
    });
});
