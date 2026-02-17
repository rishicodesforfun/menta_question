import { computeScore } from '../../src/scoring/adhd-screener';

describe('ADHD Screener Scoring Module', () => {
    test('all_min: Unlikely', () => {
        const r = computeScore(new Array(18).fill(0));
        expect(r.band).toBe('Unlikely ADHD');
        expect(r.subscaleScores?.part_a?.score).toBe(0);
    });

    test('all_max: Likely', () => {
        const r = computeScore(new Array(18).fill(4));
        expect(r.band).toBe('Likely ADHD');
        expect(r.subscaleScores?.part_a?.score).toBe(24);
        expect(r.subscaleScores?.part_b?.score).toBe(48);
    });

    test('Part A boundary: 9→Unlikely, 10→Possible', () => {
        const a9 = [2, 2, 2, 2, 1, 0, ...new Array(12).fill(0)]; // part A = 9
        expect(computeScore(a9).band).toBe('Unlikely ADHD');
        const a10 = [2, 2, 2, 2, 2, 0, ...new Array(12).fill(0)]; // part A = 10
        expect(computeScore(a10).band).toBe('Possible ADHD');
    });

    test('Part A boundary: 16→Possible, 17→Likely', () => {
        const a16 = [3, 3, 3, 3, 3, 1, ...new Array(12).fill(0)]; // part A = 16
        expect(computeScore(a16).band).toBe('Possible ADHD');
        const a17 = [3, 3, 3, 3, 3, 2, ...new Array(12).fill(0)]; // part A = 17
        expect(computeScore(a17).band).toBe('Likely ADHD');
    });

    test('Part B has no impact on band', () => {
        const a = [0, 0, 0, 0, 0, 0, ...new Array(12).fill(4)]; // part A=0, part B=48
        expect(computeScore(a).band).toBe('Unlikely ADHD');
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0])).toThrow('requires exactly 18');
    });
});
