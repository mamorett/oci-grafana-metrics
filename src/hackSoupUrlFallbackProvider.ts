import { getQueryParams } from 'runtime/util/urlParser';

const METADATA_FILE = '/supportAccount/samlMetadata.xml';

export const SOUP_URL_QUERY_PARAM = 'soupUrlOverride';
export const GLOBAL_SOUP_URL = 'https://login.oci.oraclecloud.com/v1';
export const IAD_SOUP_URL = 'https://login.us-ashburn-1.oci.oraclecloud.com/v1';
export const OSAKA_SOUP_URL = 'https://login.ap-osaka-1.oci.oraclecloud.com/v1';

const ALL_ENDPOINTS = [GLOBAL_SOUP_URL, IAD_SOUP_URL, OSAKA_SOUP_URL];

/**
 * FIXME: remove this hard-coded fallback ordering once SOUP provides
 * automatic fail over in their service.
 *
 * See https://jira.oci.oraclecorp.com/browse/DOPE-10846
 * @returns The string from the soupUrlOverride query param or
 *          the first endpoint that results in an `ok` response.
 */
export const getUrl = async () => {
  const urlFromQuery = readUrlFromQuery();
  if (urlFromQuery !== null && urlFromQuery !== undefined) {
    return urlFromQuery;
  }
  const firstUpEndpoint = await findFirstUpEndpoint();
  if (firstUpEndpoint) {
    return firstUpEndpoint;
  }
  throw Error('All SOUP endpoints are down.');
};

const readUrlFromQuery = () => {
  const queryParams = getQueryParams();
  if (queryParams.hasOwnProperty(SOUP_URL_QUERY_PARAM)) {
    return queryParams[SOUP_URL_QUERY_PARAM][0];
  }
};

const findFirstUpEndpoint = async () => {
  for (let i = 0; i < ALL_ENDPOINTS.length; i++) {
    const testEndpoint = ALL_ENDPOINTS[i] + METADATA_FILE;
    const endpointUp = await isEndpointUp(testEndpoint);
    if (endpointUp) {
      return ALL_ENDPOINTS[i];
    }
  }
};

const isEndpointUp = async (url: string) => {
  try {
    return (await fetch(url)).ok;
  } catch (err) {
    return false;
  }
};
