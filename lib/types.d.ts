export type BuildResponse = {
    id: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
};
export type LogsResponse = {
    id: string;
    buildId: string;
    data: string;
    type: string;
    status: string;
    createdAt: string;
    updatedAt: string;
};
export declare const buildEndedStatuses: string[];
export declare class BuildCreationError extends Error {
    constructor(message: string);
}
export declare class LogQueryError extends Error {
    constructor(message: string);
}
