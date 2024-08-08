import * as creeps from '../creeps/index.js';
import * as game from '../game/index.js';
import { ManageParameters, Manager } from "./types.js";

const managerName = 'builderCountManager'

const createBuilderCountManager = (): Manager => {
    return {
        manage({ goals, rooms }: ManageParameters): void {
            let hasActiveConstructionSites = false;
            for (let room of rooms) {
                if (room.lookForAtArea(LOOK_CONSTRUCTION_SITES, 0, 0, 49, 49, true).length > 0) {
                    hasActiveConstructionSites = true;
                    break;
                }
            }
            if (!hasActiveConstructionSites) {
                return;
            }

            if (game.getCreepCount("builder") >= goals.creeps.builderCount) {
                return;
            }

            for (let room of rooms) {
                if (room.energyAvailable < 200) {
                    continue;
                }

                console.log(`[${managerName}] spawn builder in room ${room.name}`);
                const spawner = game.getLocalSpawner(room);
                if (spawner.hasError()) {
                    console.log(`[${managerName}] spawn failed - no spawner in room ${room.name}`)
                    continue;
                }
                creeps.builder.archetype.spawn(spawner.value, {});
            }
        },
    };
};

export {
    createBuilderCountManager
};
