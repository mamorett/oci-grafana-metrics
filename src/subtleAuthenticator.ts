// as per https://docs.oracle.com/en-us/iaas/Content/API/Concepts/signingrequests.htm
// MDN provides good examples for Crypto API
// example https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign

import { isIntegTest } from 'testUtils/test-utils';
import { fromByteArray } from 'base64-js';

const DEFAULT_HEADERS = '(request-target) x-date host';
const CONTENT_HEADERS = ' x-content-sha256 content-type content-length';
const METHODS_WITH_BODIES = ['POST', 'PUT', 'PUSH'];
const HASH_ALGO = 'SHA-256';
const ALGO_NAME = 'RSASSA-PKCS1-v1_5';
const ALGORITHM = {
  name: ALGO_NAME,
  modulusLength: 2048,
  publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
  hash: { name: HASH_ALGO },
};

const asBuffer = (body: string): ArrayBuffer => {
  const result = new ArrayBuffer(body.length);
  const bufferView = new Uint8Array(result);
  for (let i = 0; i < body.length; i++) {
    bufferView[i] = body.charCodeAt(i);
  }
  return result;
};

const config = (function readConfigFromDisk() {
  const storedConfig = window.localStorage?.getItem('__dope.ociConfig');
  if (!storedConfig && isIntegTest()) throw Error('No OCI config found!');
  return JSON.parse(storedConfig ?? '{}');
})();

const privateKey = (async function importKey() {
  if (!config.pem) return (null as unknown) as CryptoKey;
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  const pemContents = config.pem.substring(
    pemHeader.length,
    config.pem.length - pemFooter.length - 1,
  );
  const binaryDerString = window.atob(pemContents);
  const binaryDer = asBuffer(binaryDerString);
  return await window.crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    {
      name: ALGO_NAME,
      hash: HASH_ALGO,
    },
    true,
    ['sign'],
  );
})();

const subtleCrypto =
  window.crypto &&
  (window.crypto.subtle || (window.crypto as any).webkitSubtle);

const sha256hash = async (body: string): Promise<string> => {
  const hashBuffer = await subtleCrypto.digest(HASH_ALGO, asBuffer(body));
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
};

const bodyData = async (originalReq: Request) => {
  const body = await originalReq.text();
  const hash = await sha256hash(body);
  const length = new Blob([body]).size;
  return {
    hash,
    length,
  };
};

const newBodyDataProvider = async (originalReq: Request) => {
  if (METHODS_WITH_BODIES.includes(originalReq.method)) {
    const { hash, length } = await bodyData(originalReq);
    return {
      hash: () => hash,
      length: () => length,
      isBodyMethod: true,
    };
  }
  return {
    hash: () => null as any,
    length: () => null as any,
    isBodyMethod: false,
  };
};

export const createAuthorizedRequest = async (originalReq: Request) => {
  const authorizedReq = originalReq.clone();
  const { pathname, search, hostname } = new URL(originalReq.url);
  const { hash, length, isBodyMethod } = await newBodyDataProvider(originalReq);
  const date = new Date().toUTCString();

  const addAuthzHeaders = async () => {
    const headers = await headersForReq();
    Object.entries(headers).forEach(([key, value]) =>
      authorizedReq.headers.set(key, value),
    );
  };

  const headersForReq = async () => {
    const result = await requiredHeaders();
    await maybeAddContentHeadersTo(result);
    return result;
  };

  const requiredHeaders = async () => ({
    authorization: await authorizationHeader(),
    'x-date': date,
    host: hostname,
  });

  const authorizationHeader = async () =>
    `Signature version="1",keyId="ST$${
      config.session_token
    }",algorithm="rsa-sha256",headers="${headersInSig()}",signature="${await signature()}"`;

  const headersInSig = () =>
    isBodyMethod ? DEFAULT_HEADERS + CONTENT_HEADERS : DEFAULT_HEADERS;

  const signature = async () => {
    const sigBuffer = await subtleCrypto.sign(
      ALGORITHM,
      await privateKey,
      asBuffer(signingString()),
    );
    return fromByteArray(new Uint8Array(sigBuffer));
  };

  const signingString = () => {
    const result = unconditionalPart();
    return isBodyMethod ? result + contentPart() : result;
  };

  const unconditionalPart = () =>
    `(request-target): ${requestTarget()}\nx-date: ${date}\nhost: ${hostname}`;

  const requestTarget = () =>
    `${originalReq.method.toLowerCase()} ${pathname + search}`;

  const contentPart = () =>
    `\nx-content-sha256: ${hash()}\ncontent-type: application/json\ncontent-length: ${length()}`;

  const maybeAddContentHeadersTo = async (
    headers: Record<string, string | number>,
  ) => {
    if (isBodyMethod) {
      headers['x-content-sha256'] = hash();
      headers['content-type'] = 'application/json';
      headers['content-length'] = length();
    }
  };

  await addAuthzHeaders();
  return authorizedReq;
};
