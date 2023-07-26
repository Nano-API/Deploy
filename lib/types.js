"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogQueryError = exports.BuildCreationError = exports.buildEndedStatuses = void 0;
exports.buildEndedStatuses = ['success', 'failed', 'canceled'];
class BuildCreationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BuildCreationError';
    }
}
exports.BuildCreationError = BuildCreationError;
class LogQueryError extends Error {
    constructor(message) {
        super(message);
        this.name = 'LogQueryError';
    }
}
exports.LogQueryError = LogQueryError;
//# sourceMappingURL=types.js.map