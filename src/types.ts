export type BuildResponse = {
  id: string,
  status: string,
  createdAt: Date,
  updatedAt: Date,
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

export const buildEndedStatuses = ['failure', 'online', 'canceled'];

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
