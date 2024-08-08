import * as builder from './builder.js';
import * as harvester from './harvester.js';

type Role = builder.BuilderRole | harvester.HarvesterRole;

export type {
    Role
};
export {
    builder,
    harvester,
};
