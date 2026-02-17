import { computeScore } from '../../src/scoring/psqi';

describe('PSQI Scoring Module', () => {
    test('best sleep: global 0, Good quality', () => {
        // Q1=0(time), Q2=0, Q3=0(time), Q4=0, Q5a-j=0, Q6=0, Q7=0, Q8=0, Q9=0
        const r = computeScore([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        expect(r.totalScore).toBe(0);
        expect(r.band).toBe('Good sleep quality');
    });

    test('worst sleep: global max, Poor quality', () => {
        const r = computeScore([0, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
        expect(r.band).toBe('Poor sleep quality');
        expect(r.totalScore).toBeGreaterThan(5);
    });

    test('band boundary: global ≤5 Good, >5 Poor', () => {
        // C1=1(Q9), C3=1(Q4), rest 0 → global=2 → Good
        const good = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
        expect(computeScore(good).band).toBe('Good sleep quality');
    });

    test('sleep medication flag at ≥2', () => {
        const a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0]; // Q6=2
        const r = computeScore(a);
        expect(r.escalationReasons.length).toBe(1);
        expect(r.escalationReasons[0]).toContain('sleep medication');
    });

    test('no med flag at Q6=1', () => {
        const a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
        expect(computeScore(a).escalationReasons).toHaveLength(0);
    });

    test('component scores in subscaleScores', () => {
        const r = computeScore([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        expect(r.subscaleScores?.subjective_quality?.score).toBe(0);
        expect(r.subscaleScores?.sleep_latency?.score).toBe(0);
        expect(r.subscaleScores?.sleep_medication?.score).toBe(0);
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0])).toThrow('requires exactly 18');
    });
});
