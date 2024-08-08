import * as builder from './builder.js';
import * as harvester from './harvester.js';

type Role = builder.BuilderRole | harvester.HarvesterRole;
type CreepMemoryContent = builder.BuilderCreepMemoryContent | harvester.HarvesterCreepMemoryContent;

export type {
    Role,
    CreepMemoryContent,
};
export {
    builder,
    harvester,
};
