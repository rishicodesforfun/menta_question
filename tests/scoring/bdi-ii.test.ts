import { computeScore } from '../../src/scoring/bdi-ii';

describe('BDI-II Scoring Module', () => {
    test('all_min: score 0, Minimal', () => {
        const r = computeScore(new Array(21).fill(0));
        expect(r.totalScore).toBe(0);
        expect(r.band).toBe('Minimal');
        expect(r.requiresEscalation).toBe(false);
    });

    test('all_max: score 63, Severe, Q9 triggers', () => {
        const r = computeScore(new Array(21).fill(3));
        expect(r.totalScore).toBe(63);
        expect(r.band).toBe('Severe');
        expect(r.requiresEscalation).toBe(true);
    });

    test('Q9=1 triggers escalation', () => {
        const a = new Array(21).fill(0); a[8] = 1;
        const r = computeScore(a);
        expect(r.requiresEscalation).toBe(true);
        expect(r.escalationReasons[0]).toContain('suicidal thoughts');
    });

    test('Q9=0 no escalation', () => {
        const a = new Array(21).fill(3); a[8] = 0;
        expect(computeScore(a).requiresEscalation).toBe(false);
    });

    test('band boundaries', () => {
        const a13 = new Array(21).fill(0); a13[0] = 3; a13[1] = 3; a13[2] = 3; a13[3] = 3; a13[4] = 1;
        expect(computeScore(a13).band).toBe('Minimal'); // 13
        const a14 = new Array(21).fill(0); a14[0] = 3; a14[1] = 3; a14[2] = 3; a14[3] = 3; a14[4] = 2;
        expect(computeScore(a14).band).toBe('Mild'); // 14
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0])).toThrow('requires exactly 21');
    });
});
