import { Markdown } from "@nuxt/content/parsers";
import { getOptions } from "@nuxt/content";
import { describe, test, expect } from "@jest/globals";
import fs from "fs";
import defaults from "../nuxt.config";

const locales = getLocales();

const markdown = new Markdown(getOptions().markdown);

function getLocales() {
    let localeObject = defaults.i18n.locales;
    let localeList = [];
    localeObject.forEach((element) => {
        localeList.push(element.code);
    });
    return localeList;
}

describe("About page", () => {
    const folderPath = "./content/about";

    test.each(locales)("is written for locale %s", (locale) => {
        const aboutPage = folderPath + "/" + locale + ".md";

        expect(fs.existsSync(aboutPage)).toEqual(true);
    });

    test("each locale has similar length", async () => {
        const lengths = [];
        for (const locale of locales) {
            const path = folderPath + "/" + locale + ".md";
            const file = fs.readFileSync(path, { encoding: "utf-8" });
            const parsed = await markdown.toJSON(file);
            lengths.push(parsed.text.length);
        }
        for (const l1 of lengths) {
            for (const l2 of lengths) {
                const ratio = l1 > l2 ? l1 / l2 : l2 / l1;
                expect(ratio).toBeLessThan(1.25);
            }
        }
    });
});
