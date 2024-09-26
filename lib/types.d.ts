export type Stack = {
    id: string;
    clusterId: string;
    organizationId: number;
    domain: string;
    servicePort: number;
    envs: Array<{
        key: string;
        value: string;
    }>;
    secrets: Array<{
        key: string;
        value: string;
    }>;
    livenessProbe: {
        path: string;
        periodSeconds: number;
    };
    readinessProbe: {
        path: string;
        periodSeconds: number;
        failureThresholdSeconds: number;
    };
    startupProbe: {
        path: string;
        periodSeconds: number;
        failureThresholdSeconds: number;
    };
    adapter: string;
    scaleToZeroAfterInactivitySeconds: number;
    hpaConfig: {
        minReplicas: number;
        maxReplicas: number;
        metrics: Array<{
            type: string;
            metricName: string;
            targetAverageValue: number;
            targetAverageUtilization: number;
        }>;
    };
};
export type BuildResponse = {
    id: string;
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
