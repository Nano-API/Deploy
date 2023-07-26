export const fakeOctokit = {
  rest: {
    repos: {
      get: jest.fn().mockImplementation(() => {
        return {
          data: {
            id: 123
          }
        };
      })
    }
  }
};

export const fakeContext = {
  repo: {
    owner: 'owner',
    repo: 'repo'
  },
  sha: 'sha',
  ref: 'refs/heads/branch'
};