import * as creeps from './creeps/index.js';
import * as utils from './utils/index.js';
import * as statistics from './statistics/index.js';

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
const stats = statistics.initializeStatistics(50);

const loop = () => {
    if (utils.game.getCreepCount("harvester") < goals.creeps.harvesterCount) {
        if (things.rooms.main.energyAvailable > 200) {
            console.log('Spawning a harvester!');
            creeps.harvester.archetype.spawn(things.spawner.main);
        }
    }

    for (let creep of utils.game.getCreeps()) {
        if (creeps.harvester.archetype.hasRole(creep)) {
            creeps.harvester.archetype.run({
                creep,
                statistics: stats
            });
        }
    }

    stats.processTick();
    stats.report.toConsole();
};

export {
    loop
};
