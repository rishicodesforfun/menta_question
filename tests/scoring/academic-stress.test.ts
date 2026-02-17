import { computeScore } from '../../src/scoring/academic-stress';

describe('Academic Stress Scoring Module', () => {
    test('all_min: score 0, Low', () => {
        const r = computeScore(new Array(15).fill(0));
        expect(r.totalScore).toBe(0);
        expect(r.band).toBe('Low academic stress');
    });

    test('all_max: score 60, Severe', () => {
        const r = computeScore(new Array(15).fill(4));
        expect(r.totalScore).toBe(60);
        expect(r.band).toBe('Severe academic stress');
    });

    test('subscales computed correctly', () => {
        const a = [4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const r = computeScore(a);
        expect(r.subscaleScores?.exam_pressure?.score).toBe(12);
        expect(r.subscaleScores?.social_pressure?.score).toBe(0);
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0])).toThrow('requires exactly 15');
    });
});
