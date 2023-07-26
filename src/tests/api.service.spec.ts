import { fakeOctokit, fakeContext } from './mocks';

jest.mock('@actions/github', () => {
  return {
    getOctokit: () => fakeOctokit,
    context: fakeContext
  };
});

import * as apiService from '../api.service';

describe('api.service', () => {
  test('createBuild should call the github API via octokit', async () => {
    apiService.getBuildInput();
    expect(fakeOctokit.rest.repos.get).toHaveBeenCalledTimes(1);
    expect(fakeOctokit.rest.repos.get).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo'
    });
  });

  test('getBuildInput should return the correct build params', async () => {
    const buildInput = await apiService.getBuildInput();
    expect(buildInput).toEqual({
      repoId: 123,
      repoName: 'repo',
      repoOwner: 'owner',
      branch: 'branch',
      commitSHA: 'sha'
    });
  });
});