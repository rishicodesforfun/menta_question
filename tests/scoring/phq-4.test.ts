/**
 * PHQ-4 Scoring Unit Tests
 * Tests: all_min, all_max, midpoint, band boundaries, subscale thresholds, input validation
 */

import { computeScore } from '../../src/scoring/phq-4';

describe('PHQ-4 Scoring Module', () => {
    // ─── VECTOR: all_min ─────────────────────
    test('all_min: all answers 0 → score 0, band None', () => {
        const result = computeScore([0, 0, 0, 0]);
        expect(result.totalScore).toBe(0);
        expect(result.band).toBe('None');
        expect(result.subscaleScores.anxiety.score).toBe(0);
        expect(result.subscaleScores.depression.score).toBe(0);
        expect(result.subscaleScores.anxiety.band).toBe('Below threshold');
        expect(result.subscaleScores.depression.band).toBe('Below threshold');
        expect(result.requiresEscalation).toBe(false);
        expect(result.escalationReasons).toHaveLength(0);
    });

    // ─── VECTOR: all_max ─────────────────────
    test('all_max: all answers 3 → score 12, band Severe', () => {
        const result = computeScore([3, 3, 3, 3]);
        expect(result.totalScore).toBe(12);
        expect(result.band).toBe('Severe');
        expect(result.subscaleScores.anxiety.score).toBe(6);
        expect(result.subscaleScores.depression.score).toBe(6);
        expect(result.subscaleScores.anxiety.band).toBe('Above threshold');
        expect(result.subscaleScores.depression.band).toBe('Above threshold');
    });

    // ─── VECTOR: midpoint ────────────────────
    test('midpoint: all answers 1 → score 4, band Mild', () => {
        const result = computeScore([1, 1, 1, 1]);
        expect(result.totalScore).toBe(4);
        expect(result.band).toBe('Mild');
    });

    // ─── VECTOR: band boundary None→Mild ─────
    test('boundary None/Mild: score 2 → None', () => {
        const result = computeScore([1, 1, 0, 0]);
        expect(result.totalScore).toBe(2);
        expect(result.band).toBe('None');
    });

    test('boundary None/Mild: score 3 → Mild', () => {
        const result = computeScore([1, 1, 1, 0]);
        expect(result.totalScore).toBe(3);
        expect(result.band).toBe('Mild');
    });

    // ─── VECTOR: band boundary Mild→Moderate ──
    test('boundary Mild/Moderate: score 5 → Mild', () => {
        const result = computeScore([2, 1, 1, 1]);
        expect(result.totalScore).toBe(5);
        expect(result.band).toBe('Mild');
    });

    test('boundary Mild/Moderate: score 6 → Moderate', () => {
        const result = computeScore([2, 1, 2, 1]);
        expect(result.totalScore).toBe(6);
        expect(result.band).toBe('Moderate');
    });

    // ─── VECTOR: band boundary Moderate→Severe ─
    test('boundary Moderate/Severe: score 8 → Moderate', () => {
        const result = computeScore([2, 2, 2, 2]);
        expect(result.totalScore).toBe(8);
        expect(result.band).toBe('Moderate');
    });

    test('boundary Moderate/Severe: score 9 → Severe', () => {
        const result = computeScore([3, 2, 2, 2]);
        expect(result.totalScore).toBe(9);
        expect(result.band).toBe('Severe');
    });

    // ─── SUBSCALE THRESHOLD TESTS ─────────────
    test('anxiety subscale: score 3 → Above threshold, triggers recommendation', () => {
        const result = computeScore([2, 1, 0, 0]);
        expect(result.subscaleScores.anxiety.score).toBe(3);
        expect(result.subscaleScores.anxiety.band).toBe('Above threshold');
        expect(result.escalationReasons).toContain('Anxiety subscale ≥ 3 — recommend GAD-7 assessment');
    });

    test('depression subscale: score 3 → Above threshold, triggers recommendation', () => {
        const result = computeScore([0, 0, 2, 1]);
        expect(result.subscaleScores.depression.score).toBe(3);
        expect(result.subscaleScores.depression.band).toBe('Above threshold');
        expect(result.escalationReasons).toContain('Depression subscale ≥ 3 — recommend PHQ-9 assessment');
    });

    test('both subscales above threshold', () => {
        const result = computeScore([2, 1, 2, 1]);
        expect(result.escalationReasons).toHaveLength(2);
    });

    test('neither subscale above threshold', () => {
        const result = computeScore([1, 1, 1, 0]);
        expect(result.subscaleScores.anxiety.band).toBe('Below threshold');
        expect(result.subscaleScores.depression.band).toBe('Below threshold');
        expect(result.escalationReasons).toHaveLength(0);
    });

    // ─── RAW ANSWERS IMMUTABILITY ─────────────
    test('raw answers are preserved immutably', () => {
        const input = [1, 2, 0, 3];
        const result = computeScore(input);
        expect(result.rawAnswers).toEqual([1, 2, 0, 3]);
        // Mutating input should not affect result
        input[0] = 99;
        expect(result.rawAnswers[0]).toBe(1);
    });

    // ─── NO ESCALATION (PHQ-4 safe for onboarding) ──
    test('PHQ-4 never triggers suicide/self-harm escalation', () => {
        const result = computeScore([3, 3, 3, 3]);
        expect(result.requiresEscalation).toBe(false);
    });

    // ─── INPUT VALIDATION ─────────────────────
    test('rejects wrong number of answers', () => {
        expect(() => computeScore([1, 2, 3])).toThrow('requires exactly 4 answers');
        expect(() => computeScore([1, 2, 3, 0, 1])).toThrow('requires exactly 4 answers');
    });

    test('rejects out-of-range answers', () => {
        expect(() => computeScore([0, 0, 0, 4])).toThrow('must be an integer 0–3');
        expect(() => computeScore([-1, 0, 0, 0])).toThrow('must be an integer 0–3');
    });

    test('rejects non-integer answers', () => {
        expect(() => computeScore([1.5, 0, 0, 0])).toThrow('must be an integer 0–3');
    });
});
