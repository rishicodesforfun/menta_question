import { computeScore } from '../../src/scoring/suicide-risk';

describe('Suicide Risk Screening Module', () => {
    test('all No: no risk', () => {
        const r = computeScore([0, 0, 0, 0, 0, 0]);
        expect(r.band).toBe('No risk indicators');
        expect(r.requiresEscalation).toBe(false);
        expect(r.escalationReasons).toHaveLength(0);
    });

    test('Q1=Yes: ideation flagged', () => {
        const r = computeScore([1, 0, 0, 0, 0, 0]);
        expect(r.requiresEscalation).toBe(true);
        expect(r.band).toBe('Risk flagged');
        expect(r.escalationReasons[0]).toContain('Ideation present');
    });

    test('Q4=Yes: critical risk', () => {
        const r = computeScore([0, 0, 0, 1, 0, 0]);
        expect(r.band).toBe('Critical risk');
        expect(r.escalationReasons).toContain('Ideation with intent/plan — HIGH RISK.');
    });

    test('Q6=Yes: prior attempt, critical', () => {
        const r = computeScore([0, 0, 0, 0, 0, 1]);
        expect(r.band).toBe('Critical risk');
        expect(r.escalationReasons).toContain('Prior attempt reported — CRITICAL RISK.');
    });

    test('all Yes: all reasons present', () => {
        const r = computeScore([1, 1, 1, 1, 1, 1]);
        expect(r.requiresEscalation).toBe(true);
        expect(r.band).toBe('Critical risk');
        expect(r.escalationReasons.length).toBeGreaterThanOrEqual(3);
    });

    test('rejects invalid values', () => {
        expect(() => computeScore([0, 0, 0, 0, 0, 2])).toThrow('0 (No) or 1 (Yes)');
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0])).toThrow('requires exactly 6');
    });
});
