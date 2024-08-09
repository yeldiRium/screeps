import { defekt, error, Result, value } from 'defekt';

import { HarvestIntent } from "../../state/intents";
import { HarvestingPosition } from './HarvestingPosition';

class NoHarvestingPositionAvailable extends defekt({ code: 'NoHarvestingPositionAvailable' }) {}

const chooseHarvestingPosition = (
    harvestingPositions: HarvestingPosition[],
    harvestingIntents: HarvestIntent[]
): Result<HarvestingPosition, NoHarvestingPositionAvailable> => {
    if (harvestingPositions.length === 0) {
        return error(new NoHarvestingPositionAvailable());
    }

    // TODO: respect harvesting intents. return a harvesting position that is not being harvested.

    return value(harvestingPositions[0]);
}

export {
    chooseHarvestingPosition,
};
