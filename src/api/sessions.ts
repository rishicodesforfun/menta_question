/**
 * API Stub — Session Management
 *
 * In-memory stub endpoints for managing screening sessions.
 * In production, these would be replaced by actual API calls.
 */

import { computeScore as computePHQ4Score } from '../scoring/phq-4';

// ─── Types ────────────────────────────────────

export interface Session {
    session_id: string;
    test_id: string;
    answers: (number | null)[];
    created_at: string;
    updated_at: string;
    completed: boolean;
    requires_human_review: boolean;
}

export interface SessionResult {
    session_id: string;
    test_id: string;
    total_score: number;
    band: string;
    band_description?: string;
    subscale_scores?: Record<string, { score: number; band: string }>;
    requires_escalation: boolean;
    escalation_reasons: string[];
    requires_human_review: boolean;
    computed_at: string;
}

// ─── In-Memory Store ──────────────────────────

const sessions: Map<string, Session> = new Map();

function generateId(): string {
    return `s_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

// ─── Scoring Registry ─────────────────────────

const scoringModules: Record<string, (answers: number[]) => ReturnType<typeof computePHQ4Score>> = {
    'phq-4': computePHQ4Score,
};

// ─── API Functions ────────────────────────────

/**
 * POST /sessions
 * Creates a new pseudonymous session.
 */
export function createSession(testId: string): Session {
    const session: Session = {
        session_id: generateId(),
        test_id: testId,
        answers: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed: false,
        requires_human_review: false,
    };
    sessions.set(session.session_id, session);
    return session;
}

/**
 * POST /sessions/:id/answers
 * Accepts partial or full answer set.
 */
export function submitAnswers(
    sessionId: string,
    answers: (number | null)[]
): Session {
    const session = sessions.get(sessionId);
    if (!session) {
        throw new Error(`Session not found: ${sessionId}`);
    }

    session.answers = answers;
    session.updated_at = new Date().toISOString();
    session.completed = answers.every((a) => a !== null);

    return { ...session };
}

/**
 * GET /sessions/:id/results
 * Computes score using the appropriate scoring module.
 */
export function getResults(sessionId: string): SessionResult {
    const session = sessions.get(sessionId);
    if (!session) {
        throw new Error(`Session not found: ${sessionId}`);
    }

    if (!session.completed || session.answers.some((a) => a === null)) {
        throw new Error(`Session ${sessionId} is not complete — missing answers`);
    }

    const scoreFn = scoringModules[session.test_id];
    if (!scoreFn) {
        throw new Error(`No scoring module found for test: ${session.test_id}`);
    }

    const numericAnswers = session.answers as number[];
    const scoreResult = scoreFn(numericAnswers);

    const result: SessionResult = {
        session_id: session.session_id,
        test_id: session.test_id,
        total_score: scoreResult.totalScore,
        band: scoreResult.band,
        band_description: scoreResult.bandDescription,
        subscale_scores: scoreResult.subscaleScores,
        requires_escalation: scoreResult.requiresEscalation,
        escalation_reasons: scoreResult.escalationReasons,
        requires_human_review: scoreResult.requiresEscalation,
        computed_at: new Date().toISOString(),
    };

    // Update session with review flag
    session.requires_human_review = result.requires_human_review;

    return result;
}

/**
 * GET /sessions/:id
 * Returns session metadata.
 */
export function getSession(sessionId: string): Session | undefined {
    const session = sessions.get(sessionId);
    return session ? { ...session } : undefined;
}
