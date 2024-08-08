import { createRollingAveragePerTickStatistic } from './rollingAverage.js';

interface Statistics {
    record: {
        energyProduction: (amount: number) => void;
    };
    report: {
        energyPerTick: () => number;
    };

    processTick: () => void;
}


const initializeStatistics = (windowSize: number): Statistics => {
    const producedEnergyStatistic = createRollingAveragePerTickStatistic(windowSize);

    return {
        record: {
            energyProduction: (amount: number): void => {
                producedEnergyStatistic.recordValue(amount);
            }
        },
        report: {
            energyPerTick: (): number => {
                return producedEnergyStatistic.reportAveragePerTick(windowSize).unwrapOrThrow();
            }
        },
        processTick: (): void => {
            producedEnergyStatistic.processTick();
        }
    }
};

export type {
    Statistics
};
export {
    initializeStatistics
};