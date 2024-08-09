import { CreepArchetype, CustomCreep } from './types.js';
import * as game from '../game/index.js';
import * as state from '../state/index.js';
import { uuid } from '../../utils/crypto/uuid.js';
import * as intents from '../state/intents.js';

const role = 'builder';
type BuilderRole = typeof role;
interface BuilderCreepMemoryContent {
    role: BuilderRole;
    state: 'building' | 'harvesting';
    intent: state.intents.HarvestIntent | undefined;
}
type BuilderCreep = CustomCreep<BuilderCreepMemoryContent>;

const archetype: CreepArchetype<BuilderRole, BuilderCreep> = {
    role,
    hasRole(creep: Creep): creep is BuilderCreep {
        return creep.memory.content.role === role;
    },
    spawn(spawner: StructureSpawn): void {
        spawner.spawnCreep([WORK, CARRY, MOVE], uuid(), {
            memory: {
                content: {
                    role,
                    state: 'harvesting',
                    intent: undefined,
                }
            }
        });
    },
    run(creep, { memory }): void {
        const workResult = game.findWorkForBuilder(creep);
        if (workResult.hasError()) {
            return;
        }

        const room = creep.room;

        if (creep.memory.content.state === 'building' && creep.store.getUsedCapacity() === 0) {
            creep.memory.content.state = 'harvesting';
            creep.say('harvest');
        }
        if (creep.memory.content.state === 'harvesting' && creep.store.getFreeCapacity() === 0) {
            creep.memory.content.state = 'building';
            creep.say('build')

            if (creep.memory.content.intent !== undefined) {
                intents.removeHarvestIntent(memory, creep, creep.memory.content.intent.intentId);
                creep.memory.content.intent = undefined;
            }
        }

        if (creep.memory.content.state === 'harvesting') {
            if (creep.memory.content.intent === undefined) {
                const sourceResult = game.findSourceForCreep(creep);
                if (sourceResult.hasError()) {
                    console.log(`Builder can not find source in room ${room.name}`);
                    return;
                }

                const source = sourceResult.value;
                const harvestingPositions = game.findHarvestingPositionsAroundSource(source);
                const harvestingPositionResult = game.chooseHarvestingPosition(
                    harvestingPositions,
                    intents.getRoomHarvestIntents(memory, room.name)
                );
                if (harvestingPositionResult.hasError()) {
                    creep.say('idling, no source available');
                    return;
                }

                const harvestingPosition = harvestingPositionResult.value;

                creep.memory.content.intent = intents.recordHarvestIntent(
                    memory,
                    creep,
                    source,
                    harvestingPosition
                );
            }

            const creepCoordinate = game.coordinate.fromRoomPosition(creep.pos)
            if (!game.coordinate.isEqualTo(creepCoordinate, creep.memory.content.intent.position)) {
                game.moveVisibly(creep, creep.memory.content.intent.position, '#ff0');

                return;
            }

            const source = intents.getHarvestSourceFromHarvestIntent(creep.memory.content.intent, room).unwrapOrThrow();
            const harvestResult = creep.harvest(source);
            if (harvestResult !== OK) {
                console.log(`[fatal] Creep ${creep.name} can not harvest source it intends to harvest (intent ${creep.memory.content.intent.intentId}, error ${harvestResult})`);
            }

            return;
        }

        const constructionSite = workResult.value;
        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
            game.moveVisibly(creep, constructionSite.pos, '#f00');
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
