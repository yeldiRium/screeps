import { Coordinate } from "./Coordinate";

const moveVisibly = (creep: Creep, target: RoomPosition | Coordinate, color: string): void => {
    creep.moveTo(target.x, target.y, {
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
