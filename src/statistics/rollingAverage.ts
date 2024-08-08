import { defekt, error, Result, value } from 'defekt';

import { Statistic } from './Statistic.js';

class WindowSizeLargerThanHistoryLimit extends defekt({ code: 'WindowSizeLargerThanHistoryLimit' }) {}

interface RollingAveragePerTickStatistic extends Statistic {
    recordValue: (value: number) => void;
    reportAveragePerTick: (windowSize: number) => Result<number, WindowSizeLargerThanHistoryLimit>;
}

// TODO: improve return value to include the actually used window size. This is necessary when the statistic is very young and does not contain a lot of values yet, which reduces the available window size. currently the window size is silently reduced.
const createRollingAveragePerTickStatistic = (historyLimit: number): RollingAveragePerTickStatistic => {
    const previousTicksSums: number[] = [];
    let currentTick: number[] = [];

    return {
        recordValue(value: number): void {
            currentTick.push(value);
        },
        processTick(): void {
            const sum = currentTick.reduce((acc, n) => acc + n, 0);
            previousTicksSums.push(sum);

            if (previousTicksSums.length > historyLimit) {
                previousTicksSums.splice(0, 1);
            }
            currentTick = [];
        },
        reportAveragePerTick(windowSize: number): Result<number, WindowSizeLargerThanHistoryLimit> {
            if (windowSize > historyLimit) {
                return error(new WindowSizeLargerThanHistoryLimit());
            }

            let adjustedWindowSize = windowSize;

            if (windowSize > previousTicksSums.length) {
                adjustedWindowSize = previousTicksSums.length;
            }

            if (adjustedWindowSize === 0) {
                return value(0);
            }

            const valuesInWindow = previousTicksSums.slice(-adjustedWindowSize);
            const sum = valuesInWindow.reduce((acc, n) => acc + n, 0);
            const averageInWindow = sum / adjustedWindowSize;

            return value(averageInWindow);
        }
    };
};

export type {
    RollingAveragePerTickStatistic
};
export {
    WindowSizeLargerThanHistoryLimit,
    createRollingAveragePerTickStatistic
};