import * as model from './model/index.js';
import { initializeState } from './model/state/index.js';
import * as statistics from './statistics/index.js';

const goals: model.Goals = {
    creeps: {
        builderCount: 3,
        harvesterCount: 2,
    },
};
const things = {
    rooms: {
        main: () => Game.rooms['E17S35'],
    },
    spawner: {
        main: () => Game.spawns['Spawn-E17S35'],
    },
};
const managers: model.manager.Manager[] = [
    model.manager.createHarvesterCountManager(),
    model.manager.createBuilderCountManager(),
    model.manager.createRoadBuilder(),
];
const stats = statistics.initializeStatistics(200);

////////////////////////////
// CONTROL PANEL
/////
const shouldRun = true;
let shouldInitialize = true;
////////////////////////////

const loop = () => {
    if (shouldInitialize) {
        shouldInitialize = false;
        console.log(`RUNNING INITALIZE ONCE`);

        // Put things here that should be done once at the beginning.
        const surroundings: model.Surroundings = {
            spawner: things.spawner.main(),
        };
        for (let creep of Object.values(Game.creeps)) {
            if (model.creeps.harvester.archetype.hasRole(creep)) {
                model.creeps.harvester.archetype.resetIntents(creep, {
                    statistics: stats,
                    surroundings,
                    memory: Memory,
                });
                continue;
            }
            if (model.creeps.builder.archetype.hasRole(creep)) {
                model.creeps.builder.archetype.resetIntents(creep, {
                    statistics: stats,
                    surroundings,
                    memory: Memory,
                });
                continue;
            }
        }
    }

    if (shouldRun) {
        if (Memory.state === undefined) {
            Memory.state = initializeState();
        }

        for (let manager of managers) {
            manager.manage({
                rooms: [things.rooms.main()],
                goals,
                statistics: stats,
            });
        }

        for (let creep of model.game.getCreeps()) {
            const surroundings: model.Surroundings = {
                spawner: things.spawner.main(),
            };

            if (model.creeps.harvester.archetype.hasRole(creep)) {
                model.creeps.harvester.archetype.run(creep, {
                    statistics: stats,
                    surroundings,
                    memory: Memory,
                });
                stats.record.creeps.harvester();
                continue;
            }
            if (model.creeps.builder.archetype.hasRole(creep)) {
                model.creeps.builder.archetype.run(creep, {
                    statistics: stats,
                    surroundings,
                    memory: Memory,
                });
                stats.record.creeps.builder();
                continue;
            }
        }

        stats.processTick();
        stats.report.toConsole();
    }
};

export {
    loop
};
