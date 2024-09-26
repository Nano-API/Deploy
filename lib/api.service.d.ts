import { BuildResponse, Stack } from './types';
export declare function createBuildV2FromStack(stack: Stack, repositoryId: Number, commitSha: string, token: string, apiKey: string): Promise<BuildResponse>;
export declare const watchBuild: (buildId: string) => Promise<void>;
