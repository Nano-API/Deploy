"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchBuild = exports.createBuild = exports.getBuildInput = void 0;
const github = __importStar(require("@actions/github"));
const core = __importStar(require("@actions/core"));
const types_1 = require("./types");
const baseUrl = 'https://api.nanoapi.io';
const getBuildInput = async () => {
    let buildInput;
    const token = core.getInput('token');
    core.info('Using API key: *** and starting build...');
    const context = github.context;
    console.log(`We can even get context data, like the repo: ${context.repo.repo}`);
    const repoName = context.repo.repo;
    const repoOwner = context.repo.owner;
    const branch = context.ref.replace('refs/heads/', '');
    const commitSHA = context.sha;
    const octokit = github.getOctokit(token);
    const { data: repoData } = await octokit.rest.repos.get({
        owner: repoOwner,
        repo: repoName
    });
    const repoId = repoData.id;
    return {
        repoId,
        repoName,
        repoOwner,
        branch,
        commitSHA
    };
};
exports.getBuildInput = getBuildInput;
const createBuild = async (buildInput) => {
    const apiKey = core.getInput('api_key');
    const response = await fetch(`${baseUrl}/api/v1/builds`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(buildInput)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new types_1.BuildCreationError(error.message);
    }
    const resJSON = await response.json();
    core.info(`Build started: ${resJSON.build.id}`);
    return resJSON.url;
};
exports.createBuild = createBuild;
const watchBuild = async (path) => {
    const apiKey = core.getInput('api_key');
    let resJSON;
    let since = "";
    let url;
    do {
        url = (since) ? `${baseUrl}${path}?since=${since}` : `${baseUrl}${path}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            }
        });
        if (!response.ok) {
            const error = await response.json();
            throw new types_1.LogQueryError(error.message);
        }
        resJSON = await response.json();
        resJSON.forEach((log) => {
            core.info(log.data);
            since = log.createdAt;
        });
        await new Promise((resolve) => setTimeout(resolve, 5000));
    } while (!types_1.buildEndedStatuses.includes(resJSON[resJSON.length - 1].status));
};
exports.watchBuild = watchBuild;
//# sourceMappingURL=api.service.js.map