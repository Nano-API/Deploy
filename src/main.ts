import * as core from '@actions/core';

import * as apiService from './api.service';

export const run = async (): Promise<void> => {
  try {
    const buildInput = await apiService.getBuildInput();
    core.info(
      `Build prepared for ${buildInput.repoName}#${buildInput.branch} (${buildInput.commitSHA})`
    );
  } catch (error: any) {
    core.error(error.message);
    core.setFailed(error.message);
  }
};

run();
