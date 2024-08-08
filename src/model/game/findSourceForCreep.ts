import { defekt, error, Result, value } from 'defekt';

class NoSourceFound extends defekt({ code: 'NoSourceFound' }) {}

const findSourceForCreep = (creep: Creep): Result<Source, NoSourceFound> => {
    const source = creep.pos.findClosestByRange(FIND_SOURCES);

    if (source === null) {
        return error(new NoSourceFound());
    }

    return value(source);
};

export {
    findSourceForCreep,
};
