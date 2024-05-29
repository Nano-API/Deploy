import * as github from '@actions/github';
import * as core from '@actions/core';

import {
  BuildCreationError,
  buildEndedStatuses,
  BuildResponse,
  CreateBuildInput,
  LogsResponse,
  LogQueryError
} from './types';

const baseUrl = 'https://api.nanoapi.io';

export const getBuildInput = async (): Promise<CreateBuildInput> => {
  let buildInput: CreateBuildInput;

  const token = core.getInput('token');
  core.info('Using API key: *** and starting build...');

  // Get github context data
  const context = github.context;

  const repoName = context.repo.repo;
  const repoOwner = context.repo.owner;
  const commitSHA = context.sha;

  // Get the repo id via the octokit API
  // @ts-ignore
  const octokit = github.getOctokit(token);
  const {data: repoData} = await octokit.rest.repos.get({
    owner: repoOwner,
    repo: repoName
  });

  const repoId = repoData.id;

  return {
    repoId,
    repoName,
    repoOwner,
    commitSHA
  };
};

export const createBuild = async (
  buildInput: CreateBuildInput
): Promise<string> => {
  // Make the request to the Nano-API servers to start the build.
  const apiKey = core.getInput('api_key');
  const response = await fetch(`https://api.test.nanoapi.io/build_api/v1/builds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': '4f0f3be2-c58c-428c-aa03-bfbbe60ebaa1'
    },
    body: JSON.stringify({
      planId: 1,
      repositoryId: "787399436",
      commitSHA: "c91079b835b0cc3ba550923a8c651c4aa0722fd5",
      environmentVariables: [
        {
          key: "PORT",
          value: "80"
        },
        {
          key: "NODE_ENV",
          value: "production"
        }
      ],
      secretEnvironmentVariables: [
        {
          key: "SECRET",
          value: "superdupersecret"
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new BuildCreationError(error.message);
  }

  const resJSON: BuildResponse = await response.json();
  core.info(`Build started: ${resJSON.build.id}`);
  return resJSON.url;
};

// Query the api every 5 seconds until the build is complete.
export const watchBuild = async (path: string): Promise<void> => {
  const apiKey = core.getInput('api_key');

  let resJSON: LogsResponse[];
  let since: string = '';
  let url: string;
  do {
    url = since ? `${baseUrl}${path}?since=${since}` : `${baseUrl}${path}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new LogQueryError(error.message);
    }

    resJSON = await response.json();

    resJSON.forEach(log => {
      core.info(log.data);
      since = log.createdAt;
    });
    await new Promise(resolve => setTimeout(resolve, 5000));
  } while (!buildEndedStatuses.includes(resJSON[resJSON.length - 1].status));
};
