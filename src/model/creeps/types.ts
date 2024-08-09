import { Statistics } from '../../statistics/index.js';

interface SpawnParameters {

}
interface RunParameters {
    statistics: Statistics;
    memory: Memory;
}

type CustomCreep<TMemoryContent> = Creep & {
    memory: {
        content: TMemoryContent;
    };
}

interface CreepArchetype<
    TRole extends string,
    TCreep extends Creep,
    TSpawnParameters extends SpawnParameters = {}
> {
    readonly role: TRole;
    hasRole: (creep: Creep) => creep is TCreep;
    spawn: (spawner: StructureSpawn, parameters: TSpawnParameters) => void;
    run: (creep: TCreep, parameters: RunParameters) => void;
    resetIntents: (creep: TCreep, parameters: RunParameters) => void;
}

export type {
    CreepArchetype,
    CustomCreep,
};
