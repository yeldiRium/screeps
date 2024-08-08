import { defekt, error, Result, value } from 'defekt';

class NoConstructionSiteFound extends defekt({ code: 'NoConstructionSiteFound' }) { }

const findWorkForBuilder = (creep: Creep): Result<ConstructionSite, NoConstructionSiteFound> => {
    const target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);

    if (target === null) {
        return error(new NoConstructionSiteFound());
    }

    return value(target);
};

export {
    findWorkForBuilder,
};
