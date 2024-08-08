import { Statistics } from "src/statistics/index.js";
import { Goals } from "../Goals";

interface ManageParameters {
    rooms: Room[];
    goals: Goals;
    statistics: Statistics;
}

interface Manager {
    manage: (parameters: ManageParameters) => void;
}

export type {
    ManageParameters,
    Manager
};
