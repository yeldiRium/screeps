import { State } from '../src/model/state/index.js';
import { CreepMemoryContent } from '../src/model/creeps/index.js';

declare global {
    interface CreepMemory {
        content: CreepMemoryContent;
    }
    interface Memory {
        state: State;
    }
}
