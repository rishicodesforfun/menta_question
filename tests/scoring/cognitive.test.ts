import { computeScore } from '../../src/scoring/cognitive';

describe('Cognitive Screening Module', () => {
    test('perfect: all correct, recall=5 → score 14', () => {
        // Q1-5=1(5pts) + Q6=0(skipped) + Q7=5(5pts) + Q8-Q11=1(4pts) = 14
        const r = computeScore([1, 1, 1, 1, 1, 0, 5, 1, 1, 1, 1]);
        expect(r.totalScore).toBe(14);
        expect(r.band).toBe('No significant difficulty');
    });

    test('all wrong: score 0, Possible concern', () => {
        const r = computeScore([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        expect(r.totalScore).toBe(0);
        expect(r.band).toBe('Possible cognitive concern');
    });

    test('Q6 is not scored', () => {
        const a = [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1]; // without recall
        expect(computeScore(a).totalScore).toBe(9);
    });

    test('Q7 recall 0-5 points', () => {
        const base = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let recall = 0; recall <= 5; recall++) {
            base[6] = recall;
            expect(computeScore([...base]).totalScore).toBe(recall);
        }
    });

    test('band boundary: 9 Mild, 10 No difficulty', () => {
        // [1,1,1,1,1, 0, 1, 1,1,1,1] = 5+1+4 = 10 → No significant difficulty
        expect(computeScore([1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1]).band).toBe('No significant difficulty');
        // [1,1,1,1,1, 0, 0, 1,1,1,1] = 5+0+4 = 9 → Mild
        expect(computeScore([1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1]).band).toBe('Mild cognitive difficulty');
    });

    test('rejects Q6 non-zero', () => {
        expect(() => computeScore([0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0])).toThrow('word learning');
    });

    test('rejects Q7 > 5', () => {
        expect(() => computeScore([0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0])).toThrow('integer 0–5');
    });

    test('rejects wrong count', () => {
        expect(() => computeScore([0])).toThrow('requires exactly 11');
    });
});
