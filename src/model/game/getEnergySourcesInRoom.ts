const getEnergySourcesInRoom = (room: Room): Source[] => {
    return room.find(FIND_SOURCES);
};

export {
    getEnergySourcesInRoom,
};
