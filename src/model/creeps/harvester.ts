import { CreepArchetype } from './types.js';
import { moveVisibly } from '../game/moveVisibly.js';
import { uuid } from '../../utils/crypto/uuid.js';

const role = 'harvester';
type HarvesterRole = typeof role;
interface HarvesterCreepMemory {
    role: HarvesterRole;
}
type HarvesterCreep = Creep & {
    memory: HarvesterCreepMemory;
}

const archetype: CreepArchetype<HarvesterRole, HarvesterCreep> = {
    role,
    hasRole(creep: Creep): creep is HarvesterCreep {
        return creep.memory.role === role;
    },
    spawn(spawner: StructureSpawn): void {
        spawner.spawnCreep([WORK, CARRY, MOVE], uuid(), { memory: { role } });
    },
    run(creep, { statistics, surroundings }): void {
        if (creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                moveVisibly(creep, sources[0], '#ff0');
            }
        }
        else if (surroundings.spawner.store[RESOURCE_ENERGY] < surroundings.spawner.store.getCapacity(RESOURCE_ENERGY)) {
            const carriedEnergy = creep.store[RESOURCE_ENERGY];
            const transferEnergyResult = creep.transfer(surroundings.spawner, RESOURCE_ENERGY);

            if (transferEnergyResult === ERR_NOT_IN_RANGE) {
                moveVisibly(creep, surroundings.spawner, '#ff0');
            }
            if (transferEnergyResult === OK) {
                statistics.record.energyProduction(carriedEnergy);
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
