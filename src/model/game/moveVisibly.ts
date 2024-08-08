const moveVisibly = (creep: Creep, target: RoomPosition | { pos: RoomPosition }, color: string): void => {
    creep.moveTo(target, {
        visualizePathStyle: {
            fill: 'transparent',
            stroke: color,
            lineStyle: 'dashed',
            strokeWidth: 0.15,
            opacity: 0.3
        }
    });
};

export {
    moveVisibly
};
