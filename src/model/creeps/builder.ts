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
    resetIntents(creep, { memory }): void {
        if (creep.memory.content.intent === undefined) {
            return;
        }
        intents.removeHarvestIntent(memory, creep, creep.memory.content.intent.intentId);
        creep.memory.content.intent = undefined;
    },
    run(creep, { memory }): void {
        if (creep.memory.content.state === undefined) {
            creep.memory.content.state = 'harvesting';
        }

        const workResult = game.findWorkForBuilder(creep);
        if (workResult.hasError()) {
            creep.say('idle');
            console.log(`[creep] ${creep.name}\n  idling: no work available`);
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
                const harvestingPositions = game.harvesting.findHarvestingPositionsInRoom(room);
                const harvestingPositionResult = game.harvesting.chooseHarvestingPosition(
                    harvestingPositions,
                    intents.getRoomHarvestIntents(memory, room.name)
                );
                if (harvestingPositionResult.hasError()) {
                    creep.say('idle');
                    console.log(`[creep] ${creep.name}\n  idling: no harvesting position available`)
                    return;
                }

                const harvestingPosition = harvestingPositionResult.value;

                creep.memory.content.intent = intents.recordHarvestIntent(
                    memory,
                    creep,
                    harvestingPosition.source,
                    harvestingPosition.position,
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
