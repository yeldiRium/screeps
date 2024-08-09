import { defekt, error, Result, value } from 'defekt';

class CoordinateInvalid extends defekt({ code: 'CoordinateInvalid' }) { }
class CoordinateForWrongRoom extends defekt({ code: 'CoordinateForWrongRoom' }) { }

const xMin = 0;
const yMin = 0;
const xMax = 49;
const yMax = 49;

interface Coordinate {
    x: number;
    y: number;
    room: string;
}

const fromRoomPosition = (roomPosition: RoomPosition): Coordinate => {
    return {
        x: roomPosition.x,
        y: roomPosition.y,
        room: roomPosition.roomName,
    };
};

const toRoomPosition = (coordinate: Coordinate, room: Room): Result<RoomPosition, CoordinateForWrongRoom | CoordinateInvalid> => {
    if (coordinate.room !== room.name) {
        return error(new CoordinateForWrongRoom());
    }
    const position = room.getPositionAt(coordinate.x, coordinate.y);

    if (position === null) {
        return error(new CoordinateInvalid());
    }
    return value(position);
};

const isEqualTo = (coordinateA: Coordinate, coordinateB: Coordinate): boolean => {
    return coordinateA.x === coordinateB.x &&
        coordinateA.y === coordinateB.y &&
        coordinateA.room === coordinateB.room;
}

const getNeighbours = (coordinate: Coordinate): Coordinate[] => {
    const neighbours: Coordinate[] = [];

    for (let x = coordinate.x - 1; x <= coordinate.x + 1; x++) {
        for (let y = coordinate.y - 1; y <= coordinate.y + 1; y++) {
            if (x < xMin || x > xMax || y < yMin || y > yMax) {
                continue;
            }
            if (x === coordinate.x && y === coordinate.y) {
                continue;
            }
            neighbours.push({
                x,
                y,
                room: coordinate.room,
            });
        }
    }

    return neighbours;
}

export type {
    Coordinate,
}
export {
    xMin,
    yMin,
    xMax,
    yMax,

    CoordinateInvalid,
    CoordinateForWrongRoom,
    fromRoomPosition,
    toRoomPosition,
    isEqualTo,
    getNeighbours,
}
