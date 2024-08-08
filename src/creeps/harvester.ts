import { uuid } from '../utils/crypto/uuid.js';
import { CreepArchetype } from './types.js';

const role = 'harvester';
type HarvesterRole = typeof role;
interface HarvesterCreepMemory {
    role: HarvesterRole;
}
type HarvesterCreep = Creep & {
    memory: HarvesterCreepMemory;
}

const archetype: CreepArchetype<HarvesterRole, HarvesterCreepMemory, HarvesterCreep> = {
    role,
    hasRole: (creep: Creep): creep is HarvesterCreep => {
        return creep.memory.role === role;
    },
    spawn: (spawner: StructureSpawn): void => {
        spawner.spawnCreep([WORK, CARRY, MOVE], uuid(), { memory: { role }});
    },
    run: (creep: HarvesterCreep): void => {
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
    }
}

export type {
    HarvesterRole,
    HarvesterCreepMemory,
    HarvesterCreep
}
export {
    role,
    archetype
}
