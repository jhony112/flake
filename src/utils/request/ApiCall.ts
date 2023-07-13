const nodeFetch = require("node-fetch");
const httpStatus = require("http-status");
const ApiError = require("./ApiError");
const { abortUnless } = require("./ApiResponder");
const { generateServiceAuthToken } = require("../security/token");

const fetch = async (method, url, data, headers: any = {}, external = false) => {
  let absoluteUrl = url;
  const nHeaders = { "Content-Type": "application/json", ...headers };
  if (!external) {
    // Fix authorization
    if (!nHeaders.Authorization) {
      const token = await generateServiceAuthToken();
      nHeaders.Authorization = `Bearer ${token.access.token}`;
    }

    // Fix url
    if (!absoluteUrl.startsWith("http")) {
      const noSlash = absoluteUrl.replace(/^\/+|\/+$/g, "");
      absoluteUrl = `${process.env.BASE_URL}/${noSlash}`;
    }
  }

  return resolve(
    async () =>
      nodeFetch(absoluteUrl, {
        method,
        headers: nHeaders,
        ...(data ? { body: JSON.stringify(data) } : {}),
      }),
    external
  );
};

const authFetch = async (method, url, data, headers = {}) => {
  // -->for testing
  // process.env.BASE_URL = 'https://test-api.squadinc.co';
  // global.token = {
  //   access: {
  //     token:
  //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOjEsImFkbWluIjoxLCJ0eXBlIjoiYWNjZXNzIiwibmFtZSI6IlNhbXBsZSBTZXJ2aWNlIiwicm9sZXMiOnsiQUFCQkNDRERFRUZGR0dISEpKS0siOiJhZG1pbiIsIkJCQ0NEREVFRkZHR0hISkpLS0xMIjoiYWRtaW4iLCJXQVpQWEdLUldYQUVCTUtRV1lCSiI6ImFkbWluIn19LCJpYXQiOjE2MjQyMDQzNjcsImV4cCI6MTcxNDIwNDM2NywidHlwZSI6ImFjY2VzcyJ9.lP0UiU1wjLCqrWzr1oOdxyxKAw7Xa0JQn1sKBoc44tE',
  //   },
  // };
  abortUnless(global.token, 500, "User token not set");

  return fetch(method, url, data, {
    Authorization: `Bearer ${global.token.access.token}`,
    ...headers,
  });
};
const authGET = async (url, headers = {}) => {
  return authFetch("GET", url, null, headers);
};

const authPOST = async (url, data, headers = {}) => {
  return authFetch("POST", url, data, headers);
};

const authPATCH = async (url, data, headers = {}) => {
  return authFetch("PATCH", url, data, headers);
};

const authPUT = async (url, data, headers = {}) => {
  return authFetch("PUT", url, data, headers);
};

const authDELETE = async (url, headers = {}) => {
  return authFetch("DELETE", url, null, headers);
};

const fetchGET = async (url, headers) => {
  return fetch("GET", url, null, headers);
};

const fetchPOST = async (url, data, headers) => {
  return fetch("POST", url, data, headers);
};

const fetchPATCH = async (url, data, headers) => {
  return fetch("PATCH", url, data, headers);
};

const fetchPUT = async (url, data, headers) => {
  return fetch("PUT", url, data, headers);
};

const fetchDELETE = async (url, headers) => {
  return fetch("DELETE", url, null, headers);
};

/**
 * GET an external API
 * @param url
 * @param headers
 * @returns {Promise<*|undefined>}
 */
const fetchXGET = async (url, headers) => {
  return fetch("GET", url, null, headers, true);
};

/**
 * POST to an external API
 * @param url
 * @param data
 * @param headers
 * @returns {Promise<*|undefined>}
 */
const fetchXPOST = async (url, data, headers) => {
  return fetch("POST", url, data, headers, true);
};

/**
 * PATCH on an external API
 * @param url
 * @param data
 * @param headers
 * @returns {Promise<*|undefined>}
 */
const fetchXPATCH = async (url, data, headers) => {
  return fetch("PATCH", url, data, headers, true);
};

/**
 * PATCH on an external API
 * @param url
 * @param data
 * @param headers
 * @returns {Promise<*|undefined>}
 */
const fetchXPUT = async (url, data, headers) => {
  return fetch("PUT", url, data, headers, true);
};

/**
 * DELETE on an external API
 * @param url
 * @param headers
 * @returns {Promise<*|undefined>}
 */
const fetchXDELETE = async (url, headers) => {
  return fetch("DELETE", url, null, headers, true);
};

const resolve = async (fetchFn, external = false) => {
  let res;
  try {
    res = await fetchFn();
  } catch (e) {
    console.error(e);
    throw new ApiError(httpStatus.FAILED_DEPENDENCY, "Unable to connect to service");
  }

  if (res) {
    let data: any = {};
    try {
      data = await res.json();
    } catch (e) {
      // Invalid JSON or no response content
    }

    // Success
    if (`${res.status}`.startsWith("2")) {
      return external ? data : data.data;
    }

    // Log errors
    console.error("Error Response", res);
    console.error("Error Data", data);

    // Avoid returning 401 errors, convert to 424
    if (res.status === httpStatus.UNAUTHORIZED) {
      throw new ApiError(
        httpStatus.FAILED_DEPENDENCY,
        data.message || `Connection rejected: unauthorized`
      );
    }

    // 5XX errors
    if (`${res.status}`.startsWith("5")) {
      throw new ApiError(res.status, data.message || `Service experienced an error`);
    }

    // For c# errors (different from other error data)
    if (data && data.responseCode === httpStatus.BAD_REQUEST) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        data.responseDescription || data.title || `Bad Request`
      );
    }
    // For c# errors #2
    if (data && data.title && data.status === httpStatus.BAD_REQUEST) {
      throw new ApiError(httpStatus.BAD_REQUEST, data.title || `Bad Request`);
    }

    throw new ApiError(res.status, data.message || data.reason);
  } else {
    // No response at all
    throw new ApiError(httpStatus.FAILED_DEPENDENCY, "No response from service");
  }
};

export {
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
  authGET,
  authPOST,
  authPATCH,
  authPUT,
  authDELETE,
};
