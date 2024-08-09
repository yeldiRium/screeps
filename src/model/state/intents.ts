import { Uuid } from "../../utils/crypto/uuid";

interface HarvestIntent {
    intentId: Uuid,
    source: Source,
    position: RoomPosition
}

interface RoomIntents {
    harvest: RoomPosition[];
}

interface Intents {
    rooms: Record<string, RoomIntents>;
}

export type {
    Intents,
};
