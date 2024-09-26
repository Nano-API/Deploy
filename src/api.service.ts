import * as core from '@actions/core';

import {
  BuildCreationError,
  buildEndedStatuses,
  BuildResponse,
  LogsResponse,
  LogQueryError,
  Stack
} from './types';

const baseUrl = 'https://api.test.nanoapi.io';

export async function createBuildV2FromStack(
  stack: Stack,
  repositoryId: Number,
  commitSha: string,
  token: string,
  apiKey: string
): Promise<BuildResponse> {
  const body = {
    repository: {
      id: repositoryId,
      commitSha: commitSha,
      token: token,
      provider: 'github'
    },
    stack: stack
  };
  core.info(`Sending request to NanoAPI: ${JSON.stringify(body)}`);

  const response = await fetch(`${baseUrl}/build_api/v2/builds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': `${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.json();
    core.info(`Got error from NanoAPI: ${JSON.stringify(error)}`);
    throw new BuildCreationError(error.message);
  }

  const resJSON: BuildResponse = await response.json();
  core.info(`Got response from NanoAPI: ${JSON.stringify(resJSON)}`);
  return resJSON;
}

// Query the api every 5 seconds until the build is complete.
export const watchBuild = async (buildId: string): Promise<void> => {
  const apiKey = core.getInput('apiKey');
  const path = `/build_api/v1/logs/${buildId}`;

  let resJSON: LogsResponse[];
  const pastResponses: LogsResponse[] = [];
  let since: string = '';
  let url: string;
  do {
    url = since ? `${baseUrl}${path}?since=${since}` : `${baseUrl}${path}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': `${apiKey}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new LogQueryError(error.message);
    }

    resJSON = await response.json();

    if (resJSON) {
      resJSON.forEach(log => {
        core.info(log.data);
        since = log.createdAt;
      });
      pastResponses.push(...resJSON);
    }
    await new Promise(resolve => setTimeout(resolve, 2500));
  } while (
    !buildEndedStatuses.includes(pastResponses[pastResponses.length - 1].status)
  );
};
