# Nano-API/Deploy

GitHub Action for starting a Nano API build and deploying your code as a swarm of serverless functions.

## Usage

Create a workflow (e.g. `.github/workflows/deploy.yml`) with the following content:

```yaml
name: nanoapi_build_and_deploy

on: [push]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      # Request build and stream output
      - name: Build Serverless functions and deploy via Nano API
        uses: Nano-API/Deploy@main
        with:
          # Best practice is to store your API key as a secret
          apiKey: ${{ secrets.NANO_API_KEY }}
          # Build Config ID is retrieved from the NanoAPI frontend
          buildConfigId: 'your-build-config-id'
          # Commit SHA specifies the commit to build, this can also be a branch name 'main', etc.
          commitSha: ${{ github.sha }}
          # Optional: streamLogs will stream the build logs to the GitHub Actions console
          streamLogs: true
```

## Inputs

### `apiKey`

**Required** The NanoAPI API key to use for authentication. To get this, visit the [Nano API dashboard](https://app.nanoapi.io) and create a new API key.

### `buildConfigId`

**Required** The build config ID to use for the build. This can be retrieved from the NanoAPI frontend. First, search for your repo in the NanoAPI dashboard, then click on the repo to view the build configs. The ID is the last part of the URL.

### `commitSha`

**Required** The commit SHA to build. This can also be a branch name, e.g. `main`, `feature/my-feature`, etc. This is typically injected by GitHub Actions as `${{ github.sha }}`.

### `streamLogs`

**Optional** Whether to stream the build logs to the GitHub Actions console. Default is `true`.

# Developing

## Building for Local Dev

To build the action for local development, run `npm run build`. This will create a `dist` folder containing the distributable code.

## Testing

To run the tests, run `npm test`.

## Releasing

To release a new version, run `npm run release`. This will create a new tree-shaken build using `@vercel/ncc`. You will then need to maunally tag the release and push the tag to GitHub. GitHub Actions will then automatically publish the new release to the GitHub Marketplace.