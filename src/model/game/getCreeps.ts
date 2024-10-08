import { filter } from 'lodash';

import { Role } from '../creeps/index.js';

const getCreeps = (role?: Role): Creep[] => {
    const creeps = Object.values(Game.creeps);

    if (role === undefined) {
        return creeps;
    }
    return filter(creeps, { memory: { content: { role }}});
};

export {
    getCreeps
};
