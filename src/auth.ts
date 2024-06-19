import {
  OraclePublicCloudAuthenticatorSingleton,
  GetRedirectUrl,
  RealmConfig,
} from 'duplo-authentication';
import {
  loadRegionsByRealmInto,
  getRealms,
  RegionsByRealm,
  Realm,
} from './authHelpers';
import { REALM } from './region_constants';
// import { isIntegTest } from 'testUtils/test-utils';
import { integTestAuthenticator } from './integTestSigningAuthenticator';
import * as urlProvider from './hackSoupUrlFallbackProvider';

interface SessionLength {
  [realm: string]: number;
}

export const realmList: Realm[] = [];
const regionsByRealm: RegionsByRealm = {};

export const loadRegionsByRealm = async () => {
  return loadRegionsByRealmInto(regionsByRealm);
};

export const loadRealmList = async () => {
  return getRealms(realmList);
};

export const isValidSigningRealm = (realm: string | undefined) => {
  if (!realm) {
    return false;
  }

  // cast to never since this function is a type-guard
  return !!(regionsByRealm as never)[realm];
};

const isIframe = (url: string) => url.includes('iframe');
const createRealmConfig = async (realm: string) => {
  const baseUrl = regionsByRealm[realm];
  const isOc1 = realm.toLowerCase() === 'oc1';
  const loginServiceUrl = isOc1
    ? await urlProvider.getUrl()
    : `https://login.${baseUrl}/v1`;
  const getRedirectUrlOverride: GetRedirectUrl = () => {
    const url: URL = new URL(window.location.href);

    // So that `/iframe.html` is included in the redirect uri.
    return url.href;
  };
  const soupParameters = {
    provider: 'ocna-saml',
    tenant: 'bmc_operator_access',
    noGlobalRedirect: isOc1 && !loginServiceUrl.includes('login.oci'),
  };

  return {
    getRedirectUrlOverride,
    realm,
    authorizationServiceUrl: () => `https://auth.${baseUrl}/v1`,
    landingUrl: window.location.origin,
    identityServiceUrl: `https://identity.${baseUrl}/20160918`,
    loginServiceUrl,
    soupParameters,
  };
};

const notifyAuthUpdateChange = () => {
  localStorage.setItem('auth-updated', Date.now().toString(10));
};

const restoreRoute = (url: string) => {
  notifyAuthUpdateChange();
  if (!isIframe(url)) {
    window.history.pushState(undefined, '', url);
  }
};

export const initAuth = async () => {
  // "initAuth" is called in bootstrap_app
  // So both "realmList" and "realmRegoionMap" should be initiated before any method is used in this module.
  await loadRegionsByRealm();
  await loadRealmList();
  const realmConfigs: RealmConfig[] = await Promise.all(
    realmList.map((r) => createRealmConfig(r)),
  );

  return OraclePublicCloudAuthenticatorSingleton.initialize(
    restoreRoute,
    (e) => console.error(e),
    realmConfigs,
  );
};

export const getAuth = (realm: Realm) => {
  if (isIntegTest()) {
    return integTestAuthenticator;
  }
  return OraclePublicCloudAuthenticatorSingleton.getInstance(realm as string);
};

export const isActive = (realm: Realm) => {
  const auth = getAuth(realm);

  return auth.isSessionActive();
};

export const refreshToken = async (realm: Realm): Promise<void> => {
  const auth = getAuth(realm);
  const active = await auth.isSessionActive();
  const force = true;

  if (!active) {
    // Session has already expired, do nothing.
    return;
  }

  // TODO: Remove "any" once duplo-auth deploys the PR to add this function.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (auth as any).tryRefreshToken(force);
};

export const login = async (realm: Realm) => {
  const auth = getAuth(realm);
  const realmConfig: RealmConfig = await createRealmConfig(realm);
  const error = await auth.authenticateUser(
    undefined,
    undefined,
    realmConfig.soupParameters,
  );

  if (error) {
    return new Error(error.message);
  }
};

export const logout = async (realm: Realm) => {
  const auth = getAuth(realm);

  auth.logout();
};

export const getExpiration = async (realm: Realm) => {
  const auth = getAuth(realm);
  const active = await auth.isSessionActive();

  return active ? auth.getExpiration() : null;
};

export const refreshAllTokens = () => {
  const promises = realmList.map((realm: Realm) => refreshToken(realm));

  return Promise.all(promises);
};

export const MAX_REFRESH_HOURS = 2;

const COMMERCIAL_SESSION = 60 * 60;
const GOV_SESSION = 15 * 60;

// Session length in seconds
export const SESSION_LENGTH: SessionLength = {
  [REALM.region1]: COMMERCIAL_SESSION,
  [REALM.oc1]: COMMERCIAL_SESSION,
  [REALM.oc2]: GOV_SESSION,
  [REALM.oc3]: GOV_SESSION,
  [REALM.oc4]: GOV_SESSION,
  [REALM.oc5]: GOV_SESSION,
  [REALM.oc6]: GOV_SESSION,
  [REALM.oc7]: GOV_SESSION,
  [REALM.oc8]: GOV_SESSION,
  [REALM.oc9]: GOV_SESSION,
};

export const REFRESH_OR_WARN_BEFORE_EXPIRATION = 3 * 60;

export const getMaxRefreshCountByRealm = (realm: Realm) => {
  return (MAX_REFRESH_HOURS * 60 * 60) / SESSION_LENGTH[realm];
};
