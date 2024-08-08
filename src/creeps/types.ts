import { Statistics } from '../statistics/index.js';

interface RunParameters<TCreep extends Creep> {
    creep: TCreep;
    statistics: Statistics;
}

interface CreepArchetype<TRole extends string, TMemory extends CreepMemory, TCreep extends Creep> {
    readonly role: TRole;
    hasRole: (creep: Creep) => creep is TCreep;
    spawn: (spawner: StructureSpawn) => void;
    run: (parameters: RunParameters<TCreep>) => void;
}

export type {
    CreepArchetype
};