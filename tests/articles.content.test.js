import { Markdown } from '@nuxt/content/parsers';
import { getOptions } from '@nuxt/content';
import { beforeAll, describe, test, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import defaults from '../nuxt.config'

const locales = getLocales();

const markdown = new Markdown(getOptions().markdown);

function getLocales() {
    let localeObject = defaults.i18n.locales;
    let localeList = [];
    localeObject.forEach(element => {
        localeList.push(element.code);
    });
    return localeList;
}

function getTreeList(folder) {
    const entries = [];
    const directories = ['.'];
    for (const dir of directories) {
        fs.readdirSync(path.join(folder, dir)).forEach(entry => {
            const entryPath = path.join(folder, dir, entry);
            if (fs.lstatSync(entryPath).isDirectory()) {
                directories.push(path.join(dir, entry));
            } else {
                entries.push(path.join(dir, entry));
            }
        })
    }
    return entries;
}

test('Folder structure is the same for all locales', () => {
    const localeTrees = [];
    for (const locale of locales) {
        localeTrees.push(getTreeList(`./content/articles/${locale}`));
    }
    for (const tree1 of localeTrees) {
        for (const tree2 of localeTrees) {
            expect(tree1).toEqual(tree2);
        }
    }
});

test('No articles have the same createdAt attribute', async () => {
    const dates = [];
    for (const article of getTreeList('./content/articles/en-us')) {
        const articlePath = path.join('./content/articles/en-us', article);
        const parsedArticle = await markdown.toJSON(fs.readFileSync(articlePath, {encoding: 'utf-8'}));
        dates.push(parsedArticle.createdAt);
    }
    for (const article of getTreeList('./content/music')) {
        const articlePath = path.join('./content/music', article);
        const parsedArticle = await markdown.toJSON(fs.readFileSync(articlePath, {encoding: 'utf-8'}));
        dates.push(parsedArticle.createdAt);
    }
    expect(new Set(dates).size).toEqual(dates.length);
});

test('No articles have the same filename', () => {
    const names = [];
    for (const article of getTreeList('./content/articles/en-us')) {
        const articlePath = path.join('./content/articles/en-us', article);
        names.push(path.basename(articlePath));
    }
    expect(new Set(names).size).toEqual(names.length);
});

describe('Articles', () => {
    const articles = getTreeList('./content/articles/en-us');

    describe.each(articles)('article %s', (article) => {
        const articleLocales = {};

        beforeAll(async() => {
            for (const locale of locales) {
                articleLocales[locale] = await markdown.toJSON(fs.readFileSync(path.join('./content', 'articles', locale, article), {encoding: 'utf-8'}));
            }
        })

        test('has similar length in all locales', () => {
            const lengths = [];
            for (const locale of locales) {
                lengths.push(articleLocales[locale].text.length);
            }
            for (const l1 of lengths) {
                for (const l2 of lengths) {
                    const ratio = l1 > l2 ? l1 / l2 : l2 / l1;
                    expect(ratio).toBeLessThan(1.25);
                }
            }
        });

        test('uses the same existing images in all locales', () => {
            const images = [];
            for (const locale of locales) {
                const imgs = [];
                const elements = [articleLocales[locale].body];
                for (const element of elements) {
                    if (element.type === 'element' && element.tag === 'blog-article-image') {
                        const props = element.props;
                        expect(props).toBeTruthy();
                        expect(typeof props.alt).toEqual('string');
                        expect(props.alt).toBeTruthy();
                        expect(typeof props.description).toEqual('string');
                        expect(typeof props['img-path']).toEqual('string');
                        expect(props['img-path']).toBeTruthy();
                        expect(fs.existsSync(`./static${props['img-path']}`)).toBe(true);
                        imgs.push(props['img-path']);
                    }
                    const children = element.children;
                    if (children) {
                        elements.push(...children);
                    }
                }
                images.push(imgs);
            }
            for (const i1 of images) {
                for (const i2 of images) {
                    expect(i1).toEqual(i2);
                }
            }
        });

        test('has the same createdAt attribute in all locales', () => {
            for (const locale1 of locales) {
                expect(articleLocales[locale1].createdAt).toBeTruthy();
                for(const locale2 of locales) {
                    expect(articleLocales[locale1].createdAt).toEqual(articleLocales[locale2].createdAt);
                }
            }
        });

        test('has the same existing preview image in all locales', () => {
            for (const locale1 of locales) {
                expect(articleLocales[locale1].previewImg).toBeTruthy();
                expect(fs.existsSync(path.join('./static', articleLocales[locale1].previewImg))).toBe(true);
                for (const locale2 of locales) {
                    expect(articleLocales[locale1].previewImg).toEqual(articleLocales[locale2].previewImg);
                }
            }
        });

        test('has an excerpt in all locales ("summary" property in front matter)', () => {
            for (const locale of locales) {
                expect(articleLocales[locale].summary).toBeTruthy();
            }
        });

        test('has no h1 in any locale', () => {
            for (const locale of locales) {
                const h1s = [];
                const elements = [articleLocales[locale].body];
                for (const element of elements) {
                    if (element.type === 'element' && element.tag === 'h1') {
                        h1s.push(element);
                    }
                    const children = element.children;
                    if (children) {
                        elements.push(...children);
                    }
                }
                expect(h1s).toEqual([]);
            }
        });
    });
});
