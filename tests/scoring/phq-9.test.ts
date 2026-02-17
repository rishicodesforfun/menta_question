import { computeScore } from '../../src/scoring/phq-9';

describe('PHQ-9 Scoring Module', () => {
    test('all_min: score 0, None-minimal', () => {
        const r = computeScore([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        expect(r.totalScore).toBe(0);
        expect(r.band).toBe('None-minimal');
        expect(r.requiresEscalation).toBe(false);
    });

    test('all_max: score 27, Severe', () => {
        const r = computeScore([3, 3, 3, 3, 3, 3, 3, 3, 3]);
        expect(r.totalScore).toBe(27);
        expect(r.band).toBe('Severe');
        expect(r.requiresEscalation).toBe(true);
    });

    test('band boundaries', () => {
        expect(computeScore([2, 2, 0, 0, 0, 0, 0, 0, 0]).band).toBe('None-minimal'); // 4
        expect(computeScore([2, 3, 0, 0, 0, 0, 0, 0, 0]).band).toBe('Mild'); // 5
        expect(computeScore([3, 3, 3, 1, 0, 0, 0, 0, 0]).band).toBe('Moderate'); // 10
        expect(computeScore([3, 3, 3, 3, 3, 0, 0, 0, 0]).band).toBe('Moderately severe'); // 15
        expect(computeScore([3, 3, 3, 3, 3, 3, 1, 0, 0]).band).toBe('Moderately severe'); // 19
    });

    test('Q9=1 triggers escalation', () => {
        const r = computeScore([0, 0, 0, 0, 0, 0, 0, 0, 1]);
        expect(r.requiresEscalation).toBe(true);
        expect(r.escalationReasons[0]).toContain('suicidal ideation');
    });

    test('Q9=0 no escalation', () => {
        const r = computeScore([3, 3, 3, 3, 3, 3, 3, 3, 0]);
        expect(r.requiresEscalation).toBe(false);
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0, 0, 0])).toThrow('requires exactly 9');
    });

    test('rejects out-of-range', () => {
        expect(() => computeScore([0, 0, 0, 0, 0, 0, 0, 0, 4])).toThrow('integer 0–3');
    });
});
