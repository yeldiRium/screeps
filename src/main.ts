import * as creeps from './creeps/index.js';
import { getCreepCount, getCreeps } from './utils/index.js';

const goals = {
    creeps: {
        harvesterCount: 2
    }
};
const things = {
    rooms: {
        main: Game.rooms['sim']
    },
    spawner: {
        main: Game.spawns['Spawn1']
    }
};

const loop = () => {
    if (getCreepCount("harvester") < goals.creeps.harvesterCount) {
        if (things.rooms.main.energyAvailable > 200) {
            console.log('Spawning a harvester!');
            creeps.harvester.spawnHarvester(things.spawner.main);
        }
    }

    for (let creep of getCreeps()) {
        switch (creep.memory.role) {
            case "harvester": {
                creeps.harvester.run(creep);
                break;
            }
            default: {
                break;
            }
        }
    }
};

export {
    loop
};
