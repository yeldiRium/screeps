import * as model from './model/index.js';
import * as utils from './utils/index.js';
import * as statistics from './statistics/index.js';

const goals: model.Goals = {
    creeps: {
        harvesterCount: 5,
    },
};
const things = {
    rooms: {
        main: () => Game.rooms['W57S38'],
    },
    spawner: {
        main: () => Game.spawns['Spawn1'],
    },
};
const managers: model.manager.Manager[] = [
    model.manager.createHarvesterCountManager(),
];
const stats = statistics.initializeStatistics(200);

const loop = () => {
    for (let manager of managers) {
        manager.manage({
            rooms: [things.rooms.main()],
            goals,
            statistics: stats,
        });
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
