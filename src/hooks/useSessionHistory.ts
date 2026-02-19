import { useCallback } from 'react';

const HISTORY_KEY = 'mentamind_history';

export interface TestHistoryEntry {
    testId: string;
    testTitle: string;
    totalScore: number;
    maxScore: number;
    band: string;
    completedAt: string;
}

export interface UseSessionHistoryReturn {
    addEntry: (entry: Omit<TestHistoryEntry, 'completedAt'>) => void;
    getHistory: () => TestHistoryEntry[];
    getHistoryForTest: (testId: string) => TestHistoryEntry[];
    clearHistory: () => void;
}

/**
 * Hook that tracks completed screening results in localStorage.
 * Used to show emotional trends and past results on the results page.
 */
export function useSessionHistory(): UseSessionHistoryReturn {
    const getHistory = useCallback((): TestHistoryEntry[] => {
        try {
            const raw = localStorage.getItem(HISTORY_KEY);
            if (raw) {
                return JSON.parse(raw) as TestHistoryEntry[];
            }
        } catch {
            console.warn('Failed to load session history');
        }
        return [];
    }, []);

    const addEntry = useCallback((entry: Omit<TestHistoryEntry, 'completedAt'>) => {
        try {
            const history = getHistory();
            history.push({
                ...entry,
                completedAt: new Date().toISOString(),
            });
            // Keep last 50 entries max
            const trimmed = history.slice(-50);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
        } catch {
            console.warn('Failed to save session history');
        }
    }, [getHistory]);

    const getHistoryForTest = useCallback((testId: string): TestHistoryEntry[] => {
        return getHistory().filter(e => e.testId === testId);
    }, [getHistory]);

    const clearHistory = useCallback(() => {
        try {
            localStorage.removeItem(HISTORY_KEY);
        } catch {
            console.warn('Failed to clear session history');
        }
    }, []);

    return { addEntry, getHistory, getHistoryForTest, clearHistory };
}

export default useSessionHistory;
