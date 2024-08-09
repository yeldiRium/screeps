import * as coordinate from '../Coordinate.js';
import { isPositionWalkable } from '../isPositionWalkable.js';
import { HarvestingPosition } from './HarvestingPosition.js';

const findHarvestingPositionsAroundSource = (source: Source): HarvestingPosition[] => {
    const room = source.room;
    const sourceCoordinate = coordinate.fromRoomPosition(source.pos);
    const neighbours = coordinate.getNeighbours(sourceCoordinate);

    const harvestingPositions: HarvestingPosition[] = [];

    for (let neighbour of neighbours) {
        const roomPosition = coordinate.toRoomPosition(neighbour, room).unwrapOrThrow();

        if (isPositionWalkable(roomPosition, room)) {
            harvestingPositions.push({
                position: roomPosition,
                source,
            });
        }
    }

    return harvestingPositions;
};

export {
    findHarvestingPositionsAroundSource,
};
