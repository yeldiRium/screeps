import { defekt, error, Result, value } from 'defekt';

import * as utils from '../../utils/index.js';

class NoSourceFound extends defekt({ code: 'NoSourceFound' }) {}

const findSourceForCreep = (creep: Creep): Result<Source, NoSourceFound> => {
    const sources = creep.room.find(FIND_SOURCES);
    if (sources.length === 0) {
        return error(new NoSourceFound());
    }

    const selectedSourceBucket = utils.crypto.uuid.hashUuidToBucket(creep.name, sources.length).unwrapOrThrow();

    return value(sources[selectedSourceBucket]);
};

export {
    findSourceForCreep,
};
