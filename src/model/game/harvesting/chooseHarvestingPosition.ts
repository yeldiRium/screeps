import { defekt, error, Result, value } from 'defekt';

import * as coordinate from '../Coordinate.js';
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

    // Iterate through each harvesting position and check if it is available for
    // harvesting. Return the first one available.
    for (let harvestingPosition of harvestingPositions) {
        if (harvestingIntents.every((intent): boolean => {
            return !coordinate.isEqualTo(
                coordinate.fromRoomPosition(harvestingPosition.position),
                intent.position
            );
        })) {
            return value(harvestingPosition);
        }
    }

    return error(new NoHarvestingPositionAvailable);
}

export {
    chooseHarvestingPosition,
};
