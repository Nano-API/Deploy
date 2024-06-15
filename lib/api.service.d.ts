import { BuildResponse } from './types';
export declare const createBuild: () => Promise<BuildResponse>;
export declare const watchBuild: (buildId: string) => Promise<void>;
