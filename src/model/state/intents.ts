import { defekt, error, Result, value } from 'defekt';

import { coordinate } from "../game";
import { Uuid, uuid } from "../../utils/crypto/uuid";
import { UnknownError } from 'src/utils/error';

class RemoveIntentFailed extends defekt({ code: 'RemoveIntentFailed' }) {}

interface IntentBase {
    type: string;
}

interface HarvestIntent extends IntentBase {
    type: 'harvest';
    intentId: Uuid;
    creepId: Uuid;
    source: coordinate.Coordinate;
    position: coordinate.Coordinate;
}
const createHarvestIntent = (creepId: Uuid, sourcePosition: coordinate.Coordinate, harvestPosition: coordinate.Coordinate): HarvestIntent => {
    return {
        type: 'harvest',
        intentId: uuid(),
        creepId,
        source: sourcePosition,
        position: harvestPosition,
    };
}
const getHarvestPositionFromHarvestIntent = (intent: HarvestIntent, room: Room): Result<RoomPosition, coordinate.CoordinateForWrongRoom> => {
    const positionResult = coordinate.toRoomPosition(intent.position, room);
    if (positionResult.hasError()) {
        switch (positionResult.error.code) {
            case coordinate.CoordinateInvalid.code: {
                throw positionResult.error;
            }
            case coordinate.CoordinateForWrongRoom.code: {
                return error(positionResult.error as coordinate.CoordinateForWrongRoom);
            }
            default: {
                throw new UnknownError();
            }
        }
    }
    return value(positionResult.value);
}
const getHarvestSourceFromHarvestIntent = (intent: HarvestIntent, room: Room): Result<Source, coordinate.CoordinateForWrongRoom> => {
    const positionResult = coordinate.toRoomPosition(intent.source, room);
    if (positionResult.hasError()) {
        switch (positionResult.error.code) {
            case coordinate.CoordinateInvalid.code: {
                throw positionResult.error;
            }
            case coordinate.CoordinateForWrongRoom.code: {
                return error(positionResult.error as coordinate.CoordinateForWrongRoom);
            }
            default: {
                throw new UnknownError();
            }
        }
    }

    const sourcesAtPosition = room.lookForAt(LOOK_SOURCES, positionResult.value);
    if (sourcesAtPosition.length !== 1) {
        throw new Error('[fatal] Did not find a source where a HarvestIntent said it would be.');
    }
    return value(sourcesAtPosition[0]);
}

type Intent = HarvestIntent;

interface RoomIntents {
    harvest: Record<Uuid, HarvestIntent>;
}

interface Intents {
    index: Record<Uuid, Intent>;
    rooms: Record<string, RoomIntents>;
    byCreep: Record<Uuid, Intent[]>;
}

const initializeIntents = (): Intents => {
    return {
        index: {},
        rooms: {},
        byCreep: {},
    };
};

const getRoomIntents = (memory: Memory, roomName: string): RoomIntents => {
    let roomIntents = memory.state.intents.rooms[roomName];
    if (roomIntents === undefined) {
        roomIntents = {
            harvest: {},
        };
    }
    return roomIntents;
}
const setRoomIntents = (memory: Memory, roomName: string, roomIntents: RoomIntents): void => {
    memory.state.intents.rooms[roomName] = roomIntents;
}
const getRoomHarvestIntents = (memory: Memory, roomName: string): HarvestIntent[] => {
    const roomIntents = getRoomIntents(memory, roomName);
    return [...Object.values(roomIntents.harvest)];
}

const getCreepIntents = (memory: Memory, creep: Creep): Intent[] => {
    let creepIntents = memory.state.intents.byCreep[creep.name];
    if (creepIntents === undefined) {
        creepIntents = [];
    }
    return creepIntents;
}
const setCreepIntents = (memory: Memory, creep: Creep, intents: Intent[]): void => {
    memory.state.intents.byCreep[creep.name] = intents;
}

const recordHarvestIntent = (memory: Memory, creep: Creep, source: Source, position: RoomPosition): HarvestIntent => {
    const roomName = position.roomName;

    const intent = createHarvestIntent(
        creep.name,
        coordinate.fromRoomPosition(source.pos),
        coordinate.fromRoomPosition(position),
    );

    memory.state.intents.index[intent.intentId] = intent;

    const creepIntents = getCreepIntents(memory, creep);
    creepIntents.push(intent);
    setCreepIntents(memory, creep, creepIntents);

    const roomIntents = getRoomIntents(memory, roomName);
    roomIntents.harvest[intent.intentId] = intent;
    setRoomIntents(memory, roomName, roomIntents);

    return intent;
}
const removeHarvestIntent = (memory: Memory, creep: Creep, intentId: Uuid): void => {
    const intent = memory.state.intents.index[intentId];
    if (intent === undefined) {
        return;
    }

    const creepIntents = getCreepIntents(memory, creep);
    const creepIntentsWithout = creepIntents.filter((intent): boolean => intent.intentId !== intentId);
    setCreepIntents(memory, creep, creepIntentsWithout);

    const roomIntents = getRoomIntents(memory, intent.position.room);
    delete roomIntents.harvest[intentId];
    setRoomIntents(memory, intent.position.room, roomIntents);

    delete memory.state.intents.index[intentId];
}

export type {
    Intents,
    HarvestIntent,
    Intent,
};
export {
    RemoveIntentFailed,
    initializeIntents,

    getHarvestPositionFromHarvestIntent,
    getHarvestSourceFromHarvestIntent,

    getRoomIntents,
    setRoomIntents,
    getRoomHarvestIntents,

    getCreepIntents,
    setCreepIntents,

    recordHarvestIntent,
    removeHarvestIntent,
};
