export type CreateBuildInput = {
  repoId: number;
  repoName: string;
  repoOwner: string;
  branch: string;
  commitSHA: string;
}

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
}

export type BuildResponse = {
  url: string;
  build: Build;
}

export type LogsResponse = {
  id: string;
  buildId: string;
  data: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const buildEndedStatuses = ['success', 'failed', 'canceled'];

export class BuildCreationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BuildCreationError';
  }
}

export class LogQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LogQueryError';
  }
}