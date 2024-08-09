export * as intents from './intents.js';

import { initializeIntents, Intents } from './intents.js';

interface State {
    intents: Intents;
}

const initializeState = (): State => {
    return {
        intents: initializeIntents(),
    };
};

export type {
    State,
};
export {
    initializeState,
};
