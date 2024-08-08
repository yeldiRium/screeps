import { initializeStatistics } from './index.js';
import { WindowSizeLargerThanHistoryLimit, createRollingAveragePerTickStatistic } from './rollingAverage.js';

describe('Rolling Average Statistic', (): void => {
    it('reports zero if no data has been processed yet', async (): Promise<void> => {
        const statistic = createRollingAveragePerTickStatistic(10);

        const average = statistic.reportAveragePerTick(1);

        expect(average.hasValue()).toBe(true);
        expect(average.unwrapOrThrow()).toEqual(0);
    });

    it('records values and reports the last recorded sum for a window size of 1', async (): Promise<void> => {
        const statistic = createRollingAveragePerTickStatistic(10);

        statistic.recordValue(5);
        statistic.recordValue(12);
        statistic.recordValue(55);

        statistic.processTick();

        const average = statistic.reportAveragePerTick(1);

        expect(average.hasValue()).toBe(true);
        expect(average.unwrapOrThrow()).toEqual(72);
    });

    it('reports the average over alle available ticks if the window size is larger than recorded history, but smaller than the limit', async (): Promise<void> => {
        const statistic = createRollingAveragePerTickStatistic(10);

        statistic.recordValue(5);
        statistic.recordValue(12);
        statistic.recordValue(55);

        statistic.processTick();

        const average = statistic.reportAveragePerTick(5);

        expect(average.hasValue()).toBe(true);
        expect(average.unwrapOrThrow()).toEqual(72);
    });

    it('reports the average across the given window size', async (): Promise<void> => {
        const statistic = createRollingAveragePerTickStatistic(10);

        statistic.recordValue(5);
        statistic.processTick();

        statistic.recordValue(10);
        statistic.processTick();

        statistic.recordValue(5);
        statistic.recordValue(22);
        statistic.processTick();

        const average = statistic.reportAveragePerTick(3);

        expect(average.hasValue()).toBe(true);
        expect(average.unwrapOrThrow()).toEqual(14);
    });

    it('returns an error if the requested window size is larger than the history', async (): Promise<void> => {
        const statistic = createRollingAveragePerTickStatistic(10);

        const average = statistic.reportAveragePerTick(25);

        expect(average.hasError()).toBe(true);
        expect(average.unwrapErrorOrThrow()).toBeInstanceOf(WindowSizeLargerThanHistoryLimit);
    });

    it('continuously reports averages', async (): Promise<void> => {
        const statistic = createRollingAveragePerTickStatistic(10);
        const averages = [];

        statistic.recordValue(10);
        statistic.processTick();

        statistic.recordValue(5);
        statistic.recordValue(22);
        statistic.processTick();

        averages.push(statistic.reportAveragePerTick(2).unwrapOrThrow());

        statistic.recordValue(37);
        statistic.processTick();

        averages.push(statistic.reportAveragePerTick(2).unwrapOrThrow());

        statistic.recordValue(2);
        statistic.processTick();

        averages.push(statistic.reportAveragePerTick(2).unwrapOrThrow());

        expect(averages).toEqual([
            18.5,
            32,
            19.5
        ]);
    });
});