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
        energyProducedPerTick: () => number;

        toConsole: () => void;
    };
}

const initializeStatistics = (windowSize: number): Statistics => {
    const statistics = {
        harvesterCreepsCounter: createCounterStatistic(),
        builderCreepsCounter: createCounterStatistic(),
        allCreepsCounter: createCounterStatistic(),
        producedEnergyStatistic: createRollingAveragePerTickStatistic(windowSize),
    };

    return {
        record: {
            creeps: {
                harvester(): void {
                    statistics.harvesterCreepsCounter.increaseCounter();
                    statistics.allCreepsCounter.increaseCounter();
                },
                builder(): void {
                    statistics.builderCreepsCounter.increaseCounter();
                    statistics.allCreepsCounter.increaseCounter();
                },
            },
            energyProduction(amount: number): void {
                statistics.producedEnergyStatistic.recordValue(amount);
            }
        },
        report: {
            creeps: {
                harvester(): number {
                    return statistics.harvesterCreepsCounter.reportLastValue();
                },
                builder(): number {
                    return statistics.builderCreepsCounter.reportLastValue();
                },
                all(): number {
                    return statistics.allCreepsCounter.reportLastValue();
                },
            },
            energyProducedPerTick(): number {
                return statistics.producedEnergyStatistic.reportAveragePerTick(windowSize).unwrapOrThrow();
            },
            toConsole(): void {
                console.log(stripIndent`
                    ####################
                    # Statistics Report
                    ####
                    # Average energy per tick over the last ${windowSize} ticks
                    # produced : ${(Math.round(this.energyProducedPerTick() * 100) / 100).toString().padStart(8, ' ')}
                    ####
                    # ${this.creeps.harvester().toString().padStart(5, ' ')} | Harvesters
                    # ${this.creeps.builder().toString().padStart(5, ' ')} | Builders
                    # ${this.creeps.all().toString().padStart(5, ' ')} | Total Creeps
                    ####################
                `)
            }
        },
        processTick(): void {
            for (let statistic of Object.values(statistics)) {
                statistic.processTick();
            }
        }
    }
};

export type {
    Statistics
};
export {
    initializeStatistics
};
