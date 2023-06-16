import axios from "axios";

/**
 * Escapes a url
 *
 * @param {string} path the path to escape
 * @returns the escaped path
 */
export function escapePath(path) {
    path = path.replace(/\//g, ' - ').replace(/\?/, 'escaped&escaped');
    if (path.endsWith(' - ')) {
        path = path.concat('index');
    }
    return path.trim();
}

/**
 * Unescapes a url
 *
 * @param {string} path the path to unescape
 * @returns the unescaped path
 */
export function unescapePath(path) {
    path = path.replace(/ - /g, '/').replace('escaped&escaped', '?').trim();
    if (path.endsWith('index')) {
        path = path.slice(0, -5);
    }
    return path.trim();
}

/**
 * Uploads a screenshot to an image hosting website and returns the URL for hotlinking.
 *
 * @param {string} base64img the image to upload as a base64 string
 * @returns {Promise<string>} the URL for hotlinking
 */
export async function uploadScreenshot(base64img) {
    // freeimage.host public API key. Not sensitive
    const apiKey = '6d207e02198a847aa98d0a2a901485a5';
    const uploadUrl = 'https://freeimage.host/api/1/upload';
    const postData = {
        action: 'upload',
        format: 'json',
        key: apiKey,
        source: base64img
    };
    const response = await axios.post(uploadUrl, postData, {headers: {"Content-Type": 'application/x-www-form-urlencoded'}});
    return response.data.image.url
}

/**
 * Capitalizes the first letter of the string
 *
 * @param {string} string the string to capitalize
 * @returns {string} the capitalized string
 */
export function capitalizeString(string) {
    const firstLetter = string.charAt(0);
    const restOfString = string.slice(1);
    return firstLetter.toUpperCase() + restOfString;
}