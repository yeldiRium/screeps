import { CreepArchetype } from './types.js';
import * as game from '../game/index.js';
import { uuid } from '../../utils/crypto/uuid.js';

const role = 'builder';
type BuilderRole = typeof role;
interface BuilderCreepMemory {
    role: BuilderRole;
}
type BuilderCreep = Creep & {
    memory: BuilderCreepMemory;
}

const archetype: CreepArchetype<BuilderRole, BuilderCreep> = {
    role,
    hasRole(creep: Creep): creep is BuilderCreep {
        return creep.memory.role === role;
    },
    spawn(spawner: StructureSpawn): void {
        spawner.spawnCreep([WORK, CARRY, MOVE], uuid(), { memory: { role } });
    },
    run(creep): void {
        const workResult = game.findWorkForBuilder(creep);
        if (workResult.hasError()) {
            return;
        }

        if (creep.store.getFreeCapacity() > 0) {
            const sourceResult = game.findSourceForCreep(creep);
            if (sourceResult.hasError()) {
                console.error(`Builder can not find source in room ${creep.room.name}`);
                return;
            }

            const source = sourceResult.value;
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                game.moveVisibly(creep, source, '#ff0');
            }

            return;
        }

        const constructionSite = workResult.value;
        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
            game.moveVisibly(creep, constructionSite, '#f00');
        }
    }
}

export type {
    BuilderRole,
    BuilderCreepMemory,
    BuilderCreep
}
export {
    role,
    archetype
}
