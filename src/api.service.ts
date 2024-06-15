import * as core from '@actions/core';

import {
  BuildCreationError,
  buildEndedStatuses,
  BuildResponse,
  LogsResponse,
  LogQueryError
} from './types';

const baseUrl = 'https://api.prod.nanoapi.io';

export const createBuild = async (): Promise<BuildResponse> => {
  // Make the request to the Nano-API servers to start the build.
  const apiKey = core.getInput('apiKey');
  const buildConfigId = core.getInput('buildConfigId');
  const commitSHA = core.getInput('commitSHA');
  const reqBody = { buildConfigId, commitSHA };
  core.info(`Sending request to NanoAPI: ${JSON.stringify(reqBody)}`)

  const response = await fetch(`${baseUrl}/build_api/v1/builds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': `${apiKey}`
    },
    body: JSON.stringify(reqBody)
  });

  if (!response.ok) {
    const error = await response.json();
    core.info(`Got error from NanoAPI: ${JSON.stringify(error)}`)
    throw new BuildCreationError(error.message);
  }

  const resJSON: BuildResponse = await response.json();
  core.info(`Got response from NanoAPI: ${JSON.stringify(resJSON)}`)
  return resJSON;
};

// Query the api every 5 seconds until the build is complete.
export const watchBuild = async (buildId: string): Promise<void> => {
  const apiKey = core.getInput('apiKey');
  const path = `/build_api/v1/logs/${buildId}`;

  let resJSON: LogsResponse[];
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
    }
    await new Promise(resolve => setTimeout(resolve, 2500));
  } while (!buildEndedStatuses.includes(resJSON[resJSON.length - 1].status));
};
