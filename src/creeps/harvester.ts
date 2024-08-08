import { v4 as uuid } from 'uuid';

const role = 'harvester';
type HarvesterRole = typeof role;

interface HarvesterCreepMemory {
    role: HarvesterRole;
}

const spawnHarvester = (spawn: StructureSpawn): void => {
    //spawn.spawnCreep([WORK, CARRY, MOVE], uuid(), { memory: { role }});
};

const run = (creep: Creep): void => {
    if(creep.store.getFreeCapacity() > 0) {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }
    }
    else if(Game.spawns['Spawn1'].store[RESOURCE_ENERGY] < Game.spawns['Spawn1'].store.getCapacity(RESOURCE_ENERGY)) {
        if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.spawns['Spawn1']);
        }
    }
};

export type {
    HarvesterRole,
    HarvesterCreepMemory
}
export {
    role, spawnHarvester, run
}
