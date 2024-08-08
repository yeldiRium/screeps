import * as creeps from './creeps/index.js';
import * as utils from './utils/index.js';

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
    if (utils.game.getCreepCount("harvester") < goals.creeps.harvesterCount) {
        if (things.rooms.main.energyAvailable > 200) {
            console.log('Spawning a harvester!');
            creeps.harvester.spawnHarvester(things.spawner.main);
        }
    }

    for (let creep of utils.game.getCreeps()) {
        if (creeps.harvester.isHarvesterCreep(creep)) {
            creeps.harvester.run(creep);
        }
    }
};

export {
    loop
};
