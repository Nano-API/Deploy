import * as core from '@actions/core';
import * as github from '@actions/github';
import { run } from '../main';
import * as apiService from '../api.service';
import { getStack } from '../stack';
import { Stack } from '../types';

jest.mock('@actions/core');
jest.mock('@actions/github');
jest.mock('../api.service');
jest.mock('../stack');

const mockCoreGetInput = core.getInput as jest.MockedFunction<typeof core.getInput>;
const mockCoreSetFailed = core.setFailed as jest.MockedFunction<typeof core.setFailed>;
const mockCoreError = core.error as jest.MockedFunction<typeof core.error>;
const mockGetOctokit = github.getOctokit as jest.MockedFunction<typeof github.getOctokit>;
const mockContext = github.context;

describe('run', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    process.env.GITHUB_TOKEN = 'fake-token';

    (mockContext.repo as any) = { owner: 'fake-owner', repo: 'fake-repo' };
    mockContext.sha = 'fake-sha';

    mockCoreGetInput.mockReturnValue('fake-stack');

    mockGetOctokit.mockReturnValue({
      rest: {
        repos: {
          get: jest.fn().mockResolvedValue({ data: { id: 123 } }),
        },
      },
    } as any);
  });

  test('should fail if GITHUB_TOKEN is not set', async () => {
    delete process.env.GITHUB_TOKEN;
    await run();
    expect(mockCoreError).toHaveBeenCalledWith('GITHUB_TOKEN is not set');
    expect(mockCoreSetFailed).toHaveBeenCalledWith('GITHUB_TOKEN is not set.');
  });

  test('should fail if getting repo ID fails', async () => {
    mockGetOctokit.mockReturnValue({
      rest: {
        repos: {
          get: jest.fn().mockRejectedValue(new Error('Failed to get repo ID')),
        },
      },
    } as any);

    await run();
    expect(mockCoreError).toHaveBeenCalledWith('Failed to get repo ID: Failed to get repo ID');
    expect(mockCoreSetFailed).toHaveBeenCalledWith('Failed to get repo ID');
  });

  test('should fail if getting stack fails', async () => {
    (getStack as jest.MockedFunction<typeof getStack>).mockImplementation(() => {
      throw new Error('Failed to get stack');
    });

    await run();
    expect(mockCoreError).toHaveBeenCalledWith('Failed to get stack fake-stack: Failed to get stack');
    expect(mockCoreSetFailed).toHaveBeenCalledWith('Failed to get stack');
  });

  test('should fail if creating build fails', async () => {
    (getStack as jest.MockedFunction<typeof getStack>).mockReturnValue({} as Stack);
    (apiService.createBuildV2FromStack as jest.MockedFunction<typeof apiService.createBuildV2FromStack>).mockRejectedValue(new Error('Failed to create build'));

    await run();
    expect(mockCoreError).toHaveBeenCalledWith('Failed to create build: Failed to create build');
    expect(mockCoreSetFailed).toHaveBeenCalledWith('Failed to create build');
  });

  test('should fail if watching build fails', async () => {
    (getStack as jest.MockedFunction<typeof getStack>).mockReturnValue({} as Stack);
    (apiService.createBuildV2FromStack as jest.MockedFunction<typeof apiService.createBuildV2FromStack>).mockResolvedValue({ id: 'fake-build-id' });
    (apiService.watchBuild as jest.MockedFunction<typeof apiService.watchBuild>).mockRejectedValue(new Error('Failed to watch build'));

    await run();
    expect(mockCoreError).toHaveBeenCalledWith('Failed to watch build');
    expect(mockCoreSetFailed).toHaveBeenCalledWith('Failed to watch build');
  });

  test('should run successfully', async () => {
    (getStack as jest.MockedFunction<typeof getStack>).mockReturnValue({} as Stack);
    (apiService.createBuildV2FromStack as jest.MockedFunction<typeof apiService.createBuildV2FromStack>).mockResolvedValue({ id: 'fake-build-id' });
    (apiService.watchBuild as jest.MockedFunction<typeof apiService.watchBuild>).mockResolvedValue(undefined);

    await run();
    expect(mockCoreError).not.toHaveBeenCalled();
    expect(mockCoreSetFailed).not.toHaveBeenCalled();
  });
});