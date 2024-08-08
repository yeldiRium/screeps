import { stripIndent } from 'common-tags';

import { Statistic } from './Statistic.js';
import { createRollingAveragePerTickStatistic } from './rollingAverage.js';

interface Statistics extends Statistic {
    record: {
        energyProduction: (amount: number) => void;
    };
    report: {
        energyPerTick: () => number;

        toConsole: () => void;
    };
}

const initializeStatistics = (windowSize: number): Statistics => {
    const producedEnergyStatistic = createRollingAveragePerTickStatistic(windowSize);

    return {
        record: {
            energyProduction(amount: number): void {
                producedEnergyStatistic.recordValue(amount);
            }
        },
        report: {
            energyPerTick(): number {
                return producedEnergyStatistic.reportAveragePerTick(windowSize).unwrapOrThrow();
            },
            toConsole(): void {
                console.log(stripIndent`
                    ####################
                    # Statistics Report
                    ####
                    # Average energy produced per tick over the last ${windowSize} ticks:
                    # ${Math.round(this.energyPerTick() * 100) / 100}
                    ####################
                `)
            }
        },
        processTick(): void {
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