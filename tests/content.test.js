import { Markdown } from '@nuxt/content/parsers';
import { getOptions } from '@nuxt/content';
import { describe, expect, test, beforeAll } from '@jest/globals';
import mediainfo from 'mediainfo-wrapper';
import getImageSize from 'image-size';
import fs from 'fs';

const creditFolders = [
    {tabName: 'Movies', folder: 'movies'}
]
const desiredPosterRatio = 2/3;

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
    try {
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
    } catch (error) {
        return [];
    }
}

describe('Music credits', () => {
    describe.each(creditFolders)('$tabName', ({tabName, folder}) => {
        const folderPath = './content/music/' + folder;
        const folderPaths = getPaths(folderPath);

        test('has a "'+ folder +'" folder', () => {
            expect(fs.lstatSync(folderPath).isDirectory()).toBe(true);
        })

        describe.each(folderPaths)(tabName + ' credit file %s', (path) => {
            let mediaData;
            let jsonData;

            beforeAll(async () => {
                try {
                    const file = fs.readFileSync(path, {encoding: 'utf-8'});
                    jsonData = await markdown.toJSON(file);
                } catch (error) {
                    jsonData = null;
                }
                try {
                    const data = await mediainfo(path);
                    mediaData = data[0].general;
                } catch (error) {
                    mediaData = null;
                }
            })

            test('is a file', () => {
                expect(fs.lstatSync(path).isFile()).toBe(true);
            })

            test('is a markdown file', async () => {
                expect(mediaData).toHaveProperty('file_extension');
                const file_extension = mediaData.file_extension;
                expect(file_extension).toHaveLength(1);
                expect(file_extension[0]).toBe('md');
            })

            test('has an "imgPath" attribute', () => {
                let img;
                try {
                    img = jsonData.imgPath;
                } catch (error) {
                    img = null;
                }
                expect(img).toBeTruthy();
            })

            describe('Poster image (specified via "imgPath")', () => {
                let imgPath;
                let imgData;

                beforeAll(async () => {
                    try {
                        imgPath = './static' + jsonData.imgPath;
                    } catch (error) {
                        imgPath = null;
                    }
                    if (imgPath) {
                        try {
                            const data = await mediainfo(imgPath);
                            imgData = data[0].general;
                        } catch (error) {
                            imgData = null;
                        }
                    }
                })

                test('is a valid file', () => {
                    expect(fs.lstatSync(imgPath).isFile()).toBe(true);
                })

                test('is an image', () => {
                    expect(imgData).toHaveProperty('internet_media_type');
                    const mediaTypes = imgData.internet_media_type;
                    mediaTypes.forEach(mediaType => {
                        expect(mediaType).toContain('image/');
                    })
                })

                test('has the correct aspect ratio (close to 2:3)', () => {
                    const imageDimensions = getImageSize(imgPath);
                    const width = imageDimensions.width;
                    const height = imageDimensions.height;
                    const ratio = width / height;
                    expect(ratio).toBeCloseTo(desiredPosterRatio, 1);
                })
            })

            test('has a "releaseDate" attribute', () => {
                let date;
                try {
                    date = jsonData.releaseDate;
                } catch (error) {
                    date = null;
                }
                expect(date).toBeTruthy();
            })

            describe('Release date (specified via "releaseDate")', () => {
                let releaseDate;

                beforeAll(() => {
                    try {
                        releaseDate = jsonData.releaseDate;
                    } catch (error) {
                        releaseDate = null;
                    }
                })

                test('is a valid date string', () => {
                    const date = new Date(releaseDate);
                    expect(date).toBeInstanceOf(Date);
                    let isoString;
                    try {
                        isoString = date.toISOString();
                    } catch (error) {
                        isoString = null;
                    }
                    expect(isoString).toBeTruthy();
                })

                test('is a UTC date string', () => {
                    const yearString = releaseDate.slice(0, 4);
                    const yearDash = releaseDate.charAt(4);
                    const monthString = releaseDate.slice(5, 7);
                    const monthDash = releaseDate.charAt(7);
                    const dayString = releaseDate.slice(8, 10);
                    const letterT = releaseDate.charAt(10);
                    const hourString = releaseDate.slice(11, 13);
                    const hourSemicolon = releaseDate.charAt(13);
                    const minuteString = releaseDate.slice(14, 16);
                    const minuteSemicolon = releaseDate.charAt(16);
                    const secondString = releaseDate.slice(17, 19);
                    const letterZ = releaseDate.charAt(19);

                    expect(parseInt(yearString)).toBeGreaterThan(0);
                    expect(parseInt(yearString)).toBeLessThan(10000);
                    expect(yearDash).toBe('-');
                    expect(parseInt(monthString)).toBeGreaterThan(0);
                    expect(parseInt(monthString)).toBeLessThanOrEqual(12);
                    expect(monthDash).toBe('-');
                    expect(parseInt(dayString)).toBeGreaterThan(0);
                    expect(parseInt(dayString)).toBeLessThanOrEqual(31);
                    expect(letterT).toBe('T');
                    expect(parseInt(hourString)).toBeGreaterThanOrEqual(0);
                    expect(parseInt(hourString)).toBeLessThan(24);
                    expect(hourSemicolon).toBe(':');
                    expect(parseInt(minuteString)).toBeGreaterThanOrEqual(0);
                    expect(parseInt(minuteString)).toBeLessThan(60);
                    expect(minuteSemicolon).toBe(':');
                    expect(parseInt(secondString)).toBeGreaterThanOrEqual(0);
                    expect(parseInt(secondString)).toBeLessThan(60);
                    expect(letterZ).toBe('Z');
                })
            })
        })
    })
})
