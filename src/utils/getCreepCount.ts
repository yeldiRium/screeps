import { filter } from 'lodash';

import { Role } from '../creeps/index.js';

const getCreepCount = (role?: Role): number => {
	let creeps = Object.values(Game.creeps);

	if (role !== undefined) {
		creeps = filter(creeps, { memory: { role }});
	}

	return creeps.length;
};

export {
	getCreepCount
};
