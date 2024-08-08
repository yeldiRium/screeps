import * as model from './model/index.js';
import * as utils from './utils/index.js';
import * as statistics from './statistics/index.js';

const goals = {
    creeps: {
        harvesterCount: 3
    }
};
const things = {
    rooms: {
        main: () => Game.rooms['W57S38']
    },
    spawner: {
        main: () => Game.spawns['Spawn1']
    }
};
const stats = statistics.initializeStatistics(200);

const loop = () => {
    if (model.game.getCreepCount("harvester") < goals.creeps.harvesterCount) {
        if (things.rooms.main().energyAvailable > 200) {
            console.log('Spawning a harvester!');
            model.creeps.harvester.archetype.spawn(things.spawner.main(), {});
        }
    }

    for (let creep of model.game.getCreeps()) {
        const surroundings: model.Surroundings = {
            spawner: things.spawner.main()
        };

        if (model.creeps.harvester.archetype.hasRole(creep)) {
            model.creeps.harvester.archetype.run(creep, {
                statistics: stats,
                surroundings
            });
        }
    }

    stats.processTick();
    stats.report.toConsole();
};

export {
    loop
};
