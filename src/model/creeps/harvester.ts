import { CreepArchetype, CustomCreep } from './types.js';
import * as game from '../game/index.js';
import { uuid } from '../../utils/crypto/uuid.js';

const role = 'harvester';
type HarvesterRole = typeof role;
interface HarvesterCreepMemoryContent {
    role: HarvesterRole;
}
type HarvesterCreep = CustomCreep<HarvesterCreepMemoryContent>;

const archetype: CreepArchetype<HarvesterRole, HarvesterCreep> = {
    role,
    hasRole(creep: Creep): creep is HarvesterCreep {
        return creep.memory.content.role === role;
    },
    spawn(spawner: StructureSpawn): void {
        spawner.spawnCreep([WORK, CARRY, MOVE], uuid(), { memory: { content: { role }}});
    },
    run(creep, { statistics, surroundings }): void {
        const spawnerResult = game.getLocalSpawner(creep.room);
        if (spawnerResult.hasError()) {
            console.log(`Harvester can not find spawner in room ${creep.room.name}`);
            return;
        }

        if (creep.store.getFreeCapacity() > 0) {
            const sourceResult = game.findSourceForCreep(creep);
            if (sourceResult.hasError()) {
                console.log(`Harvester can not find source in room ${creep.room.name}`);
                return;
            }

            const source = sourceResult.value;
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                game.moveVisibly(creep, source.pos, '#ff0');
            }

            return;
        }

        const spawner = spawnerResult.value;
        if (spawner.store[RESOURCE_ENERGY] < spawner.store.getCapacity(RESOURCE_ENERGY)) {
            const carriedEnergy = creep.store[RESOURCE_ENERGY];
            const transferEnergyResult = creep.transfer(surroundings.spawner, RESOURCE_ENERGY);

            if (transferEnergyResult === ERR_NOT_IN_RANGE) {
                game.moveVisibly(creep, surroundings.spawner.pos, '#ff0');
            }
            if (transferEnergyResult === OK) {
                statistics.record.energyProduction(carriedEnergy);
            }
        }
    }
}

export type {
    HarvesterRole,
    HarvesterCreepMemoryContent,
    HarvesterCreep
}
export {
    role,
    archetype
}
