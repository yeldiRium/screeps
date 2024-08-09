const isPositionWalkable = (roomPosition: RoomPosition, room: Room): boolean => {
    const objects = room.lookAt(roomPosition);

    for (let object of objects) {
        if (object.type === LOOK_TERRAIN) {
            if (object.terrain === 'wall') {
                return false;
            }
        }
        if (object.type === LOOK_STRUCTURES) {
            if (object.structure?.structureType !== STRUCTURE_ROAD) {
                return false;
            }
        }
    }

    return true;
};

export {
    isPositionWalkable,
};
