import * as coordinate from './Coordinate.js';
import { isPositionWalkable } from './isPositionWalkable.js';

const findHarvestingPositionsAroundSource = (source: Source): RoomPosition[] => {
    const room = source.room;
    const sourceCoordinate = coordinate.fromRoomPosition(source.pos);
    const neighbours = coordinate.getNeighbours(sourceCoordinate);

    const harvestingPositions: RoomPosition[] = [];

    for (let neighbour of neighbours) {
        const roomPosition = coordinate.toRoomPosition(neighbour, room).unwrapOrThrow();

        if (isPositionWalkable(roomPosition, room)) {
            harvestingPositions.push(roomPosition);
        }
    }

    return harvestingPositions;
};

export {
    findHarvestingPositionsAroundSource,
};
