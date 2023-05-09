import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';
import * as tc from '@actions/tool-cache';
import fs from 'fs';
import os from 'os';
import http from 'http';
import path from 'path';
import childProcess from 'child_process';
import treeKill from 'tree-kill';
import { fileURLToPath } from 'url';
import { Builder, until, By, Browser } from 'selenium-webdriver';
import * as Chrome from 'selenium-webdriver/chrome.js';
import defaults from '../../nuxt.config.js';

const prNumber = github.context.payload.pull_request?.number;
if (!prNumber && process.env.GITHUB_ACTIONS) {
    throw new Error('This script can be run only on pull requests');
}

const staticPages = ['', 'about', 'news', 'games', 'projects', 'music', 'music?id=SpongebobSquarePantsMovieRehydrated'];
const changedPages = [];
const baseUrl = 'http://localhost:3000/';
const locales = [];
let testStatic = false;

for (const locale of defaults.i18n.locales) {
    locales.push(locale.code);
}

if (process.env.GITHUB_ACTIONS) {
    const octokit = github.getOctokit(process.env.TOKEN);
    const octokitOptions = {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: prNumber,
        per_page: 100
    };

    for await (const response of octokit.paginate.iterator('GET /repos/{owner}/{repo}/pulls/{pull_number}/files', octokitOptions)) {
        const data = response.data;
        for (const file of data) {
            if (file.status === 'added' || file.status === 'changed' || file.status === 'modified') {
                if (file.filename.endsWith('.md') && file.filename.startsWith('content/articles')) {
                    const splitPath = file.filename.split('/');
                    changedPages.push(`${splitPath[2]}/projects/${splitPath.at(-1).replace('.md', '')}`);
                } else {
                    const websiteDirectories = ['assets/', 'components/', 'lang/', 'layouts/', 'pages/', 'plugins/', 'static/', 'nuxt.config.js']
                    for (const dir of websiteDirectories) {
                        if (file.filename.includes(dir)) {
                            testStatic = true;
                        }
                    }
                }
            }
        }
    }
}

const chromeOptions = new Chrome.Options();

async function websiteUp() {
    return await new Promise((resolve, reject) => {
        http.get(baseUrl, (res) => {resolve(res.statusCode === 200)}).on('error', (e) => {resolve(false)})
    });
}

core.startGroup('Starting server');
const baseDirectory = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
core.info(`Base directory: ${baseDirectory}`);
core.info('Starting server process...');
const serverProcess = childProcess.exec('npm run start', {cwd: baseDirectory});
while (!(await websiteUp())) {
    await new Promise(resolve => setTimeout(resolve, 1000));
}
core.info('Server started');
core.endGroup();

core.startGroup('Preparing screenshot directory');
const screenshotDirectory = path.join(baseDirectory, 'screenshots');
core.info('Cleaning directory...');
if (fs.existsSync(screenshotDirectory)) {
    fs.rmSync(screenshotDirectory, {force: true, recursive: true});
}
core.info('Creating directory...');
fs.mkdirSync(screenshotDirectory, {recursive: true});
core.endGroup();

const urls = [];

if (testStatic) {
    core.info('Testing static pages with screenshot testing...');
    for (const locale of locales) {
        for (const page of staticPages) {
            urls.push(`${locale}/${page}`);
        }
    }
} else {
    core.info('Skipping screenshot testing for static pages');
}
urls.push(...changedPages);

let browsers = [];

switch (process.platform) {
    case 'darwin':
        browsers.push(Browser.SAFARI);
        await exec.exec('sudo safaridriver --enable', [], {silent: true});
        break;
    case 'linux':
        const chrome = await tc.downloadTool('https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb', path.join(os.tmpdir(), 'chrome.deb'));
        await exec.exec('sudo dpkg -i', [chrome], {silent: true});
    case 'win32':
        await import('chromedriver');
        browsers.push(Browser.CHROME);
        break;
    default:
        throw `Architecture ${process.platform} is not supported`;
}

const screenshots = [];

for (const browser of browsers) {
    core.startGroup(`Testing for browser: ${browser}`);

    core.info('Creating Selenium instance...');
    const driver = await new Builder()
        .forBrowser(browser)
        .setChromeOptions(chromeOptions.headless())
        .build();
    await driver.manage().window().setRect({width: 1920, height: 1});
    core.info('Selenium instance ready');

    for (const page of urls) {
        core.info(`Testing page ${page}...`);

        await driver.get(baseUrl.concat(page));
        await driver.sleep(3000);

        let currentHeight = 1;
        let oldHeight = 0;
        const width = (await driver.manage().window().getSize()).width;
        while (currentHeight !== oldHeight) {
            oldHeight = currentHeight;
            await driver.manage().window().setRect({width: width, height: currentHeight});
            currentHeight = Math.ceil(parseFloat(await driver.executeScript('return document.body.parentNode.scrollHeight')));
        }
        const heightDiff = Math.ceil(parseFloat(await driver.executeScript('return window.outerHeight - window.innerHeight')));
        await driver.manage().window().setRect({width: width, height: currentHeight + heightDiff});

        const escapedPath = page.replace(/\//g, ' - ').replace(/\?/, '&');
        const screenshotPath = path.join(screenshotDirectory, `${escapedPath.endsWith(' - ') ? escapedPath.concat('index') : escapedPath} (${browser}).png`);
        const screenshot = await driver.findElement(By.css('body')).takeScreenshot();
        await fs.promises.writeFile(screenshotPath, screenshot, {encoding: 'base64'});
        screenshots.push(screenshotPath);
    }

    core.info('Closing selenium instance...');
    await driver.quit();
    core.info('Selenium instance successfully closed');

    core.endGroup();
}

core.startGroup('Shut down server');
core.info('Shutting down server...');
treeKill(serverProcess.pid);
core.info('Server shut down successfully');
core.endGroup();

core.setOutput('screenshots', screenshots.join('\n'));
core.setOutput('artifact_name', `screenshots-${process.platform}`);
