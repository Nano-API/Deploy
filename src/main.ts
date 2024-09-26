import * as core from '@actions/core';
import * as github from '@actions/github';

import * as apiService from './api.service';
import {getStack} from './stack';
import {Stack} from './types';

export const run = async (): Promise<void> => {
  const stackName = core.getInput('stackName');

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    core.error('GITHUB_TOKEN is not set');
    core.setFailed('GITHUB_TOKEN is not set.');
    return;
  }

  let repoId: number;
  try {
    const octokit = github.getOctokit(token);
    const {owner, repo} = github.context.repo;
    const {data: repoData} = await octokit.rest.repos.get({
      owner,
      repo
    });
    repoId = repoData.id;
  } catch (error: any) {
    core.error(`Failed to get repo ID: ${error.message}`);
    core.setFailed(error.message);
    return;
  }

  let stack: Stack;
  try {
    stack = getStack(stackName);
  } catch (error: any) {
    core.error(`Failed to get stack ${stackName}: ${error.message}`);
    core.setFailed(error.message);
    return;
  }

  let buildId: string;
  try {
    const buildRes = await apiService.createBuildV2FromStack(
      stack,
      repoId,
      github.context.sha,
      token,
      core.getInput('apiKey')
    );
    buildId = buildRes.id;
  } catch (error: any) {
    core.error(`Failed to create build: ${error.message}`);
    core.setFailed(error.message);
    return;
  }

  try {
    await apiService.watchBuild(buildId);
  } catch (error: any) {
    core.error(error.message);
    core.setFailed(error.message);
    return;
  }
};

run();
