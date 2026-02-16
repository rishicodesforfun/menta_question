/**
 * PHQ-4 Integration Test
 * End-to-end flow: create session → submit answers → get results → assert score + band
 */

import { createSession, submitAnswers, getResults } from '../../src/api/sessions';

describe('PHQ-4 Integration Test', () => {
    test('full flow: create session → submit all_min answers → score 0, band None', () => {
        const session = createSession('phq-4');
        expect(session.session_id).toBeTruthy();
        expect(session.test_id).toBe('phq-4');
        expect(session.completed).toBe(false);

        const updated = submitAnswers(session.session_id, [0, 0, 0, 0]);
        expect(updated.completed).toBe(true);

        const results = getResults(session.session_id);
        expect(results.total_score).toBe(0);
        expect(results.band).toBe('None');
        expect(results.requires_escalation).toBe(false);
        expect(results.escalation_reasons).toHaveLength(0);
        expect(results.subscale_scores?.anxiety.score).toBe(0);
        expect(results.subscale_scores?.depression.score).toBe(0);
    });

    test('full flow: all_max answers → score 12, band Severe', () => {
        const session = createSession('phq-4');
        submitAnswers(session.session_id, [3, 3, 3, 3]);

        const results = getResults(session.session_id);
        expect(results.total_score).toBe(12);
        expect(results.band).toBe('Severe');
        expect(results.subscale_scores?.anxiety.score).toBe(6);
        expect(results.subscale_scores?.anxiety.band).toBe('Above threshold');
        expect(results.subscale_scores?.depression.score).toBe(6);
        expect(results.subscale_scores?.depression.band).toBe('Above threshold');
    });

    test('full flow: mild distress with anxiety flagged', () => {
        const session = createSession('phq-4');
        submitAnswers(session.session_id, [2, 1, 0, 0]);

        const results = getResults(session.session_id);
        expect(results.total_score).toBe(3);
        expect(results.band).toBe('Mild');
        expect(results.subscale_scores?.anxiety.band).toBe('Above threshold');
        expect(results.subscale_scores?.depression.band).toBe('Below threshold');
        expect(results.escalation_reasons).toContain(
            'Anxiety subscale ≥ 3 — recommend GAD-7 assessment'
        );
    });

    test('full flow: moderate distress with depression flagged', () => {
        const session = createSession('phq-4');
        submitAnswers(session.session_id, [1, 1, 2, 2]);

        const results = getResults(session.session_id);
        expect(results.total_score).toBe(6);
        expect(results.band).toBe('Moderate');
        expect(results.subscale_scores?.depression.band).toBe('Above threshold');
        expect(results.escalation_reasons).toContain(
            'Depression subscale ≥ 3 — recommend PHQ-9 assessment'
        );
    });

    test('partial answers → getResults throws', () => {
        const session = createSession('phq-4');
        submitAnswers(session.session_id, [1, null, null, null]);

        expect(() => getResults(session.session_id)).toThrow('not complete');
    });

    test('invalid session → throws', () => {
        expect(() => getResults('nonexistent')).toThrow('Session not found');
    });

    test('session is pseudonymous (no PII)', () => {
        const session = createSession('phq-4');
        expect(session.session_id).toMatch(/^s_/);
        // Session should not contain any user-identifiable info
        const keys = Object.keys(session);
        expect(keys).not.toContain('user_id');
        expect(keys).not.toContain('email');
        expect(keys).not.toContain('name');
    });
});
