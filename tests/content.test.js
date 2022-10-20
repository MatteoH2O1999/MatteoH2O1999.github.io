import { Markdown } from '@nuxt/content/parsers';
import { getOptions } from '@nuxt/content';
import { describe, expect, test } from '@jest/globals';
import fs from 'fs';

const markdown = new Markdown(getOptions().markdown)

function getRelativePaths(path) {
    const tmp = fs.readdirSync(path);
    let paths = [];
    tmp.forEach(element => {
        paths.push(path.concat('/', element));
    });
    return paths;
}

function getPaths(path) {
    let paths = getRelativePaths(path);
    let returnPaths = [];
    while (paths.length > 0) {
        const currentPath = paths.pop();
        returnPaths.push(currentPath);
        if (fs.lstatSync(currentPath).isDirectory()) {
            paths.push(...getRelativePaths(currentPath))
        }
    }
    return returnPaths;
}

describe('Music content', () => {
    describe('Movies', () => {
        const moviesPath = './content/music/movies';
        const moviesPaths = getPaths(moviesPath);

        test('has a "movies" folder', () => {
            expect(fs.lstatSync(moviesPath).isDirectory()).toBe(true);
        })

        describe.each(moviesPaths)('path %s', (path) => {
            test('is not a directory', () => {
                expect(fs.lstatSync(path).isDirectory()).toBe(false);
            })
        })
    })
})
