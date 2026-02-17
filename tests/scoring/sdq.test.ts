import { computeScore } from '../../src/scoring/sdq';

describe('SDQ Scoring Module', () => {
    test('all_min: difficulties 0, Normal', () => {
        const r = computeScore(new Array(25).fill(0));
        expect(r.totalScore).toBe(0);
        expect(r.band).toBe('Normal');
    });

    test('all_max: difficulties 40, prosocial 10', () => {
        const r = computeScore(new Array(25).fill(2));
        expect(r.totalScore).toBe(40); // 4*5*2 = 40 (excluding prosocial)
        expect(r.subscaleScores?.prosocial?.score).toBe(10);
        expect(r.band).toBe('High difficulties');
    });

    test('prosocial not in total difficulties', () => {
        const a = new Array(25).fill(0);
        for (let i = 20; i < 25; i++) a[i] = 2; // only prosocial
        const r = computeScore(a);
        expect(r.totalScore).toBe(0); // prosocial excluded
        expect(r.subscaleScores?.prosocial?.score).toBe(10);
    });

    test('band boundary: 13→Normal, 14→Borderline', () => {
        const a13 = new Array(25).fill(0);
        // Set 13 difficulty items to 1
        for (let i = 0; i < 13; i++) a13[i] = 1;
        expect(computeScore(a13).band).toBe('Normal');
        const a14 = [...a13]; a14[13] = 1;
        expect(computeScore(a14).band).toBe('Borderline');
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0])).toThrow('requires exactly 25');
    });
});
