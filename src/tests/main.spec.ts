import { fakeContext, fakeOctokit } from "./mocks";

jest.mock("@actions/github", () => {
  return {
    getOctokit: () => fakeOctokit,
    context: fakeContext
  };
});

const setFailedMock = jest.fn();
jest.mock("@actions/core", () => {
  return {
    getInput: jest.fn().mockImplementation(() => {
      return "fake-input";
    }),
    info: jest.fn(),
    setFailed: setFailedMock,
    error: jest.fn()
  };
});

import { run } from "../main";

describe('main', () => {
  test('Should successfully run the build setup code', async () => {
    await run();
    expect(fakeOctokit.rest.repos.get).toHaveBeenCalledTimes(1);
    expect(fakeOctokit.rest.repos.get).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo'
    });
    expect(setFailedMock).toHaveBeenCalledTimes(0);
  });

  test('Should fail if the build setup code fails', async () => {
    fakeOctokit.rest.repos.get.mockImplementationOnce(() => {
      throw new Error('fake-error');
    });
    await run();
    expect(setFailedMock).toHaveBeenCalledTimes(1);
    expect(setFailedMock).toHaveBeenCalledWith('fake-error');
  });
});
