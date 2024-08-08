import * as game from '../game/index.js';
import { ManageParameters, Manager } from "./types.js";

const managerName = 'roadBuilder';

const createRoadBuilder = (): Manager => {
    const findStreetsFromSpawnerToSources = (
        room: Room,
        spawner: StructureSpawn,
        sources: Source[],
    ): RoomPosition[] => {
        const positions: RoomPosition[] = [];

        for (let source of sources) {
            const path = room.findPath(spawner.pos, source.pos, {
                ignoreCreeps: true,
            });
            const pathWithoutSourceTile = path.slice(0, -1);
            for (let pathStep of pathWithoutSourceTile) {
                positions.push(room.getPositionAt(pathStep.x, pathStep.y)!);
            }
        }

        return positions;
    };

    return {
        manage({ rooms }: ManageParameters): void {
            for (let room of rooms) {
                const streetTilesToBeBuilt: RoomPosition[] = [];

                const sources = game.getEnergySourcesInRoom(room);
                const spawner = game.getLocalSpawner(room);

                if (spawner.hasValue()) {
                    const positions = findStreetsFromSpawnerToSources(room, spawner.value, sources);
                    streetTilesToBeBuilt.push(...positions.filter(
                        (roomPosition): boolean => !game.doesPositionHaveRoadOrConstruction(room, roomPosition)
                    ));
                }

                console.log(`[${managerName}] adding ${streetTilesToBeBuilt.length} new road construction sites to room ${room.name}`);

                for (let roomPosition of streetTilesToBeBuilt) {
                    room.createConstructionSite(
                        roomPosition,
                        STRUCTURE_ROAD,
                    );
                }
            }
        },
    };
};

export {
    createRoadBuilder,
};
