import * as core from '@actions/core';
import * as github from '@actions/github';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { capitalizeString, unescapePath, uploadScreenshot } from './utils.js';

const baseDirectory = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const screenshotDirectory = path.join(baseDirectory, 'screenshots');

const octokit = github.getOctokit(process.env.TOKEN);
const prNumber = github.context.payload.pull_request?.number;
if (!prNumber && process.env.GITHUB_ACTIONS) {
    throw new Error('This script can be run only on pull requests');
}

const screenshots = [];
for (const folder of ['screenshots-darwin', 'screenshots-linux']) {
    const dir = path.join(screenshotDirectory, folder);
    if (!fs.existsSync(dir)) {
        continue;
    }
    for (const screenshot of fs.readdirSync(dir)) {
        screenshots.push({
            browser: screenshot.split('(')[1].split(')')[0],
            path: path.join(dir, screenshot),
            url: '/'.concat(unescapePath(screenshot.split('(')[0]))
        });
    }
}

if (screenshots.length === 0) {
    core.info('No screenshots to upload. Skipping...');
    process.exit(0);
}

core.startGroup('Uploading screenshots');
for (const screenshot of screenshots) {
    core.info(`Uploading screenshot ${screenshot.url} for browser ${screenshot.browser}`);
    const image = fs.readFileSync(screenshot.path).toString('base64');
    screenshot.uploadUrl = await uploadScreenshot(image);
}
core.endGroup();

const groupedScreenshots = {};

for (const screenshot of screenshots) {
    if (!Object.keys(groupedScreenshots).includes(screenshot.url)) {
        groupedScreenshots[screenshot.url] = {};
    }
    groupedScreenshots[screenshot.url][screenshot.browser] = screenshot.uploadUrl;
}

for (const link of Object.keys(groupedScreenshots)) {
    if (Object.keys(groupedScreenshots[link]).length !== 2) {
        throw new Error(`Expected 2 browsers for link ${link}, got ${groupedScreenshots[link].length}.\n${JSON.stringify(groupedScreenshots, null, 2)}`);
    }
}

const firstLines = '# Screenshot testing\n\n';

let body = firstLines;

for (const link of Object.keys(groupedScreenshots)) {
    const links = groupedScreenshots[link];
    body += `<details>\n<summary><h2>${link.slice(1)}</h2></summary>\n\n`;
    for (const browser of Object.keys(links)) {
        body += `<details>\n<summary><h3>${capitalizeString(browser)}</h3></summary>\n\n![${capitalizeString(browser)}](${links[browser]})</details>\n\n`;
    }
    body += '</details>\n\n';
}

const octokitOptions = {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: prNumber,
    per_page: 100
};
const candidates = [];
for await (const response of octokit.paginate.iterator('GET /repos/{owner}/{repo}/issues/{issue_number}/comments', octokitOptions)) {
    const comments = response.data;
    for (const comment of comments) {
        if (comment.body.startsWith(firstLines) && comment.user.login === 'github-actions[bot]') {
            candidates.push(comment.id);
        }
    }
}
if (candidates.length > 1) {
    throw new Error('More than one screenshot testing report found');
}
if (candidates.length === 0) {
    const commentOptions = {
        body,
        issue_number: prNumber,
        owner: github.context.repo.owner,
        repo: github.context.repo.repo
    };
    core.info('Creating comment...');
    const response = await octokit.rest.issues.createComment(commentOptions);
    if (response.status !== 201) {
        throw new Error('Error in creating PR comment');
    }
    core.info('Comment successfully created');
} else {
    const comment = candidates[0];
    const commentOptions = {
        body: body,
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        comment_id: comment
    };
    core.info('Updating comment...');
    const response = await octokit.rest.issues.updateComment(commentOptions);
    if (response.status !== 200) {
        throw new Error('Error in updating PR comment');
    }
    core.info('Comment successfully updated');
}
