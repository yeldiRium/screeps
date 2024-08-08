import * as creeps from '../creeps/index.js';
import * as game from '../game/index.js';
import { ManageParameters, Manager } from "./types";

const managerName = 'harvesterCountManager'

const createHarvesterCountManager = (): Manager => {
    return {
        manage({ goals, rooms }: ManageParameters): void {
            if (game.getCreepCount("harvester") >= goals.creeps.harvesterCount) {
                return;
            }

            for (let room of rooms) {
                if (room.energyAvailable < 200) {
                    continue;
                }

                console.log(`[${managerName}] spawn harvester in room ${room.name}`);
                const spawner = game.getLocalSpawner(room);
                if (spawner.hasError()) {
                    console.log(`[${managerName}] spawn failed - no spawner in room ${room.name}`)
                    continue;
                }
                creeps.harvester.archetype.spawn(spawner.value, {});
            }
        },
    };
};

export {
    createHarvesterCountManager
};
