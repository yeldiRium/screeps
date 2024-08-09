import { HarvestingPosition } from "./HarvestingPosition";
import { findHarvestingPositionsAroundSource } from "./findHarvestingPositionsAroundSource";

const findHarvestingPositionsInRoom = (room: Room): HarvestingPosition[] => {
    const harvestingPositions: HarvestingPosition[] = [];

    const sources = room.find(FIND_SOURCES);
    for (let source of sources) {
        harvestingPositions.push(...findHarvestingPositionsAroundSource(source));
    }

    return harvestingPositions;
}

export {
    findHarvestingPositionsInRoom,
};
