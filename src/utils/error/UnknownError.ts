import { defekt } from 'defekt';

class UnknownError extends defekt({ code: 'UnknownError' }) {}

export {
    UnknownError,
};
