import { CreateBuildInput } from './types';
export declare const getBuildInput: () => Promise<CreateBuildInput>;
export declare const createBuild: (buildInput: CreateBuildInput) => Promise<string>;
export declare const watchBuild: (path: string) => Promise<void>;
