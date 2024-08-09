import { CreepArchetype, CustomCreep } from './types.js';
import * as game from '../game/index.js';
import { uuid } from '../../utils/crypto/uuid.js';
import * as intents from '../state/intents.js';
import { stripIndent } from 'common-tags';

const role = 'harvester';
type HarvesterRole = typeof role;
interface HarvesterCreepMemoryContent {
    role: HarvesterRole;
    state: 'harvesting' | 'delivering';
    intent: intents.HarvestIntent | undefined;
}
type HarvesterCreep = CustomCreep<HarvesterCreepMemoryContent>;

const archetype: CreepArchetype<HarvesterRole, HarvesterCreep> = {
    role,
    hasRole(creep: Creep): creep is HarvesterCreep {
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
    run(creep, { memory, statistics, surroundings }): void {
        if (creep.memory.content.state === undefined) {
            creep.memory.content.state = 'harvesting';
        }

        const room = creep.room;

        const spawnerResult = game.getLocalSpawner(room);
        if (spawnerResult.hasError()) {
            console.log(`Harvester can not find spawner in room ${room.name}`);
            return;
        }
        const spawner = spawnerResult.value;

        if (spawner.store[RESOURCE_ENERGY] >= spawner.store.getCapacity(RESOURCE_ENERGY)) {
            creep.say('idle');
            console.log(`[creep] ${creep.name}\n  idling: no energy capacity in room`);
            return;
        }

        if (creep.memory.content.state === 'delivering' && creep.store.getUsedCapacity() === 0) {
            creep.memory.content.state = 'harvesting';
            creep.say('harvest');
        }
        if (creep.memory.content.state === 'harvesting' && creep.store.getFreeCapacity() === 0) {
            creep.memory.content.state = 'delivering';
            creep.say('deliver')

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
                    console.log(`[creep] ${creep.name}\n  idling: no harvesting position available`);
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

export type {
    HarvesterRole,
    HarvesterCreepMemoryContent,
    HarvesterCreep
}
export {
    role,
    archetype
}
