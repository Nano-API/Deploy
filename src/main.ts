import * as core from '@actions/core';

import * as apiService from './api.service';

export const run = async (): Promise<void> => {
  try {
    const buildInput = await apiService.getBuildInput();
    core.info(
      `Build prepared for ${buildInput.repoName} (${buildInput.commitSHA})`
    );

    const buildUrl = await apiService.createBuild(buildInput);
    core.info(`Build started, you can watch it at ${buildUrl}`);
  } catch (error: any) {
    core.error(error.message);
    core.setFailed(error.message);
  }
};

run();
