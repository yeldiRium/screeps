import { CreepArchetype, CustomCreep } from './types.js';
import * as game from '../game/index.js';
import { uuid } from '../../utils/crypto/uuid.js';

const role = 'builder';
type BuilderRole = typeof role;
interface BuilderCreepMemoryContent {
    role: BuilderRole;
    state: 'building' | 'harvesting';
}
type BuilderCreep = CustomCreep<BuilderCreepMemoryContent>;

const archetype: CreepArchetype<BuilderRole, BuilderCreep> = {
    role,
    hasRole(creep: Creep): creep is BuilderCreep {
        return creep.memory.content.role === role;
    },
    spawn(spawner: StructureSpawn): void {
        spawner.spawnCreep([WORK, CARRY, MOVE], uuid(), { memory: { content: { role, state: 'harvesting' }}});
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
    BuilderCreepMemoryContent,
    BuilderCreep
}
export {
    role,
    archetype
}
