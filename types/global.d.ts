import { CreepMemoryContent } from '../src/model/creeps/index.js';

declare global {
    interface CreepMemory {
        content: CreepMemoryContent;
    }
}
