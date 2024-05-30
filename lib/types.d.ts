export type CreateBuildInput = {
    repoId: number;
    repoName: string;
    repoOwner: string;
    commitSHA: string;
};
export type Build = {
    id: string;
    repoId: string;
    orgId: number;
    status: string;
    version: number;
    commitSHA: string;
    branch: string;
    startedBy: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
};
export type BuildResponse = {
    url: string;
    build: Build;
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
