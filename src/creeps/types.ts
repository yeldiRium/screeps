interface CreepArchetype<TRole extends string, TMemory extends CreepMemory, TCreep extends Creep> {
    readonly role: TRole;
    hasRole: (creep: Creep) => creep is TCreep;
    spawn: (spawner: StructureSpawn) => void;
    run: (creep: TCreep) => void;
}

export type {
    CreepArchetype
};