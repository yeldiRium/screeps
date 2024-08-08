import { Statistic } from "./Statistic";

interface CounterStatistic extends Statistic {
    increaseCounter: () => void;
    reportLastValue: () => number;
}

const createCounterStatistic = (): CounterStatistic => {
    let previousValue = 0;
    let currentCounter = 0;

    return {
        processTick(): void {
            previousValue = currentCounter;
            currentCounter = 0;
        },
        increaseCounter(): void {
            currentCounter += 1;
        },
        reportLastValue(): number {
            return previousValue;
        },
    };
};

export {
    createCounterStatistic,
};
