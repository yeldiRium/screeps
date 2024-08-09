import * as model from './model/index.js';
import { initializeState } from './model/state/index.js';
import * as statistics from './statistics/index.js';

const goals: model.Goals = {
    creeps: {
        builderCount: 3,
        harvesterCount: 2,
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
        for (let creep of Object.values(Game.creeps)) {
            if (model.creeps.harvester.archetype.hasRole(creep)) {
                model.creeps.harvester.archetype.resetIntents(creep, {
                    statistics: stats,
                    memory: Memory,
                });
                continue;
            }
            if (model.creeps.builder.archetype.hasRole(creep)) {
                model.creeps.builder.archetype.resetIntents(creep, {
                    statistics: stats,
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
                rooms: [...Object.values(Game.rooms)],
                goals,
                statistics: stats,
            });
        }

        for (let creep of model.game.getCreeps()) {
            if (model.creeps.harvester.archetype.hasRole(creep)) {
                model.creeps.harvester.archetype.run(creep, {
                    statistics: stats,
                    memory: Memory,
                });
                stats.record.creeps.harvester();
                continue;
            }
            if (model.creeps.builder.archetype.hasRole(creep)) {
                model.creeps.builder.archetype.run(creep, {
                    statistics: stats,
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
