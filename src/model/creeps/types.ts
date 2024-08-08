import { Statistics } from '../../statistics/index.js';
import { Surroundings } from '../Surroundings.js';

interface SpawnParameters {

}
interface RunParameters {
    statistics: Statistics;
    surroundings: Surroundings;
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
}

export type {
    CreepArchetype
};
