import * as core from '@actions/core';

import * as apiService from './api.service';

export const run = async (): Promise<void> => {
  try {
    const streamLogs = core.getInput('streamLogs') || true;
    const buildRes = await apiService.createBuild();
    if (streamLogs) {
      core.info(`Build started. Streaming logs...`);
      core.info('This can be disabled by setting the `streamLogs` input to false.');
    }
  } catch (error: any) {
    core.error(error.message);
    core.setFailed(error.message);
  }
};

run();
