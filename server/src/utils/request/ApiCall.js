/* eslint-disable no-console */
const nodeFetch = require('node-fetch');
const httpStatus = require('http-status');
const ApiError = require('./ApiError');

const resolve = async (url, option, external = false) => {
    let res;
    try {
        res = await nodeFetch(url, option);
        return res;
    } catch (e) {
        console.error(`Request ${url}`, option);
        console.error(e);
        throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Unable to connect to service');
    }
};

/**
 * Perform an HTTP request.
 *
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param {string} url - The URL to which the request should be made.
 * @param {Object} data - The data to send with the request.
 * @param {Object} [options={}] - Additional options for the request (optional).
 * @returns {Promise<Object>} - A Promise that resolves to the response data.
 * @throws {Error} - If an error occurs during the request.
 */
const fetch = async (method, url, data, options = {}) => {
    const absoluteUrl = url;
    const { timeout = 20000, external = false, ...headers } = options;
    const nHeaders = { 'Content-Type': 'application/json', ...headers };

    return resolve(
        absoluteUrl,
        {
            method,
            timeout,
            headers: nHeaders,
            ...(data ? { body: JSON.stringify(data) } : {}),
        },
        external
    );
};

/**
 * GET request to an internal service
 * @param url
 * @param headers
 * @returns {Promise<*|undefined>}
 */
const fetchGET = async (url, headers) => fetch('GET', url, null, headers);

/**
 * POST request to an internal service
 * @param url
 * @param data
 * @param headers
 * @returns {Promise<*|undefined>}
 */
const fetchPOST = async (url, data, headers) => fetch('POST', url, data, headers);

/**
 * PATCH request to an internal service
 * @param url
 * @param data
 * @param headers
 * @returns {Promise<*|undefined>}
 */
const fetchPATCH = async (url, data, headers) => fetch('PATCH', url, data, headers);

/**
 * PUT request to an internal service
 * @param url
 * @param data
 * @param headers
 * @returns {Promise<*|undefined>}
 */
const fetchPUT = async (url, data, headers) => fetch('PUT', url, data, headers);

/**
 * Delete request to an internal service
 * @param url
 * @param headers
 * @returns {Promise<*|undefined>}
 */
const fetchDELETE = async (url, headers) => fetch('DELETE', url, null, headers);

/**
 * GET an external API
 * @param url
 * @param headers
 * @returns {Promise<*|undefined>}
 */
const fetchXGET = async (url, headers) => fetch('GET', url, null, headers, true);

/**
 * POST to an external API
 * @param url
 * @param data
 * @param headers
 * @returns {Promise<*|undefined>}
 */
const fetchXPOST = async (url, data, headers) => fetch('POST', url, data, { ...headers, external: true });

/**
 * PATCH on an external API
 * @param url
 * @param data
 * @param headers
 * @returns {Promise<*|undefined>}
 */
const fetchXPATCH = async (url, data, headers) => fetch('PATCH', url, data, { ...headers, external: true });

/**
 * PATCH on an external API
 * @param url
 * @param data
 * @param headers
 * @returns {Promise<*|undefined>}
 */
const fetchXPUT = async (url, data, headers) => fetch('PUT', url, data, { ...headers, external: true });

/**
 * DELETE on an external API
 * @param url
 * @param headers
 * @returns {Promise<*|undefined>}
 */
const fetchXDELETE = async (url, headers) => fetch('DELETE', url, null, { ...headers, external: true });

module.exports = {
    fetch,
    fetchGET,
    fetchPOST,
    fetchPATCH,
    fetchPUT,
    fetchDELETE,
    fetchXGET,
    fetchXPOST,
    fetchXPUT,
    fetchXPATCH,
    fetchXDELETE,
};
