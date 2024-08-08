import { defekt, error, Result, value } from 'defekt';

class NoLocalSpawnerFound extends defekt({ code: 'NoLocalSpawnerFound' }) {}

const getLocalSpawner = (room: Room): Result<StructureSpawn, NoLocalSpawnerFound> => {
    const spawners = room.find(FIND_MY_STRUCTURES, { filter: {
        structureType: STRUCTURE_SPAWN,
    }}) as StructureSpawn[];

    if (spawners.length === 0) {
        return error(new NoLocalSpawnerFound());
    }

    return value(spawners[0]);
}

export {
    getLocalSpawner,
};
