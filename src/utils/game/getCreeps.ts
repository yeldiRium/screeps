import { filter } from 'lodash';

import { Role } from '../../creeps/index.js';

const getCreeps = (role?: Role): Creep[] => {
	const creeps = Object.values(Game.creeps);

	return filter(creeps, { memory: { role }});
};

export {
	getCreeps
};
