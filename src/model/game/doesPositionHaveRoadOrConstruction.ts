const doesPositionHaveRoadOrConstruction = (
    room: Room,
    roomPosition: RoomPosition,
): boolean => {
    const objects = room.lookAt(roomPosition);

    for (let object of objects) {
        if (object.type === 'constructionSite' && object.constructionSite?.structureType === 'road') {
            return true;
        }
        if (object.type === 'structure' && object.structure?.structureType === 'road') {
            return true;
        }
    }

    return false;
};

export {
    doesPositionHaveRoadOrConstruction,
};
