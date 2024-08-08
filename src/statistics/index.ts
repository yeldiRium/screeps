import { stripIndent } from 'common-tags';

import { Statistic } from './Statistic.js';
import { createCounterStatistic } from './counter.js';
import { createRollingAveragePerTickStatistic } from './rollingAverage.js';

interface Statistics extends Statistic {
    record: {
        creeps: {
            harvester: () => void;
            builder: () => void;
        };
        energyProduction: (amount: number) => void;
    };
    report: {
        creeps: {
            harvester: () => number;
            builder: () => number;
            all: () => number;
        }
        energyPerTick: () => number;

        toConsole: () => void;
    };
}

const initializeStatistics = (windowSize: number): Statistics => {
    const harvesterCreepsCounter = createCounterStatistic();
    const builderCreepsCounter = createCounterStatistic();
    const allCreepsCounter = createCounterStatistic();
    const producedEnergyStatistic = createRollingAveragePerTickStatistic(windowSize);

    return {
        record: {
            creeps: {
                harvester(): void {
                    harvesterCreepsCounter.increaseCounter();
                    allCreepsCounter.increaseCounter();
                },
                builder(): void {
                    builderCreepsCounter.increaseCounter();
                    allCreepsCounter.increaseCounter();
                },
            },
            energyProduction(amount: number): void {
                producedEnergyStatistic.recordValue(amount);
            }
        },
        report: {
            creeps: {
                harvester(): number {
                    return harvesterCreepsCounter.reportLastValue();
                },
                builder(): number {
                    return builderCreepsCounter.reportLastValue();
                },
                all(): number {
                    return allCreepsCounter.reportLastValue();
                },
            },
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
                    ####
                    # ${this.creeps.harvester().toString().padStart(5, ' ')} | Harvesters
                    # ${this.creeps.builder().toString().padStart(5, ' ')} | Builders
                    # ${this.creeps.all().toString().padStart(5, ' ')} | Total Creeps
                    ####################
                `)
            }
        },
        processTick(): void {
            harvesterCreepsCounter.processTick();
            builderCreepsCounter.processTick();
            allCreepsCounter.processTick();
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
