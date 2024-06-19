import { RegionSummary } from '@clients/devops-ui-service-api-client';
import _ from 'lodash';
import memoizeOne from 'memoize-one';
import {
  REALM,
  ALL_REGIONS,
  ALL_REALMS_WITH_SUMMARY,
  REGIONS,
  EarlyRegions,
  Region,
  defaultRegionIdMapping,
  DEFAULT_REALM,
  CURRENT_REALM_OVERRIDE,
  AD,
  AvailabilityDomain,
  Realm,
  RegionState,
  realmType,
  IDENTITY_AIRPORT_CODE_REGIONS,
} from 'region_constants';
import { isTest } from 'testUtils/test-utils';
import { JIRA_SD_URL_BASE } from './constants';

/**
 * @deprecated import { getRegionNameByHostName } from 'dope-commons'
 *
 * Get region from hostname
 * @param hostname
 * @returns
 */
export const getRegionNameByHostName = (
  hostname: string | undefined,
): string | null => {
  if (!hostname) {
    return null;
  }
  const regex = /devops\.(.*?)\.oci/g;
  const match = regex.exec(hostname);

  if (!match || match.length < 2) {
    // No match, set to oc1 by default;
    return null;
  }

  return match?.[1];
};

/**
 * @deprecated import { REALMS } from 'dope-commons'
 *
 * All realms known by the CURRENT REALM
 * e.g., ['oc5'] if current realm is oc5.
 */
export const ALL_REALMS = [...new Set(ALL_REGIONS.map((r) => r.realm))].sort();

/**
 * @deprecated import { COMM_REALMS } from 'dope-commons'
 *
 * All commercial realms known by the CURRENT REALM
 * It's an empty array in ONSR realms
 */
export const COMM_REALMS = [
  ...new Set(ALL_REGIONS.filter((r) => !r.isDisconnected).map((r) => r.realm)),
].sort();

/**
 * @deprecated import { SOVEREIGN_REALMS } from 'dope-commons'
 *
 * All sovereign realms.
 */
export const SOVEREIGN_REALMS = [
  ...new Set(ALL_REGIONS.filter((r) => r.isSovereign).map((r) => r.realm)),
].sort();

/**
 * @deprecated import { getRealmByRegion } from 'dope-commons'
 */
export const getRealmByRegion = (region: string): REALM => {
  const matchedRegion = ALL_REGIONS.find(
    (r: Region) => r.dns === region || r.alias === region,
  );

  if (!matchedRegion) {
    return REALM.oc1;
  }

  return matchedRegion.realm;
};

/**
 * @deprecated import { CurrentRealmConfig } from 'dope-commons'
 */
export interface CurrentRealmConfig {
  isTest: boolean;
  hostname: string;
  realmOverride?: REALM;
}
/**
 * @deprecated import { getRealmForHostname } from 'dope-commons'
 *
 * Get the current realm from environment of DNS
 * * Test => oc1
 * * localhost => realm override or oc1
 * * staging/production => get realm from the region in DNS, oc1 by default.
 * @param config
 */
export const getRealmForHostname = ({
  isTest,
  hostname,
  realmOverride,
}: CurrentRealmConfig): REALM => {
  if (!hostname) {
    throw Error('Hostname must be provided to find realm.');
  }

  if (hostname === 'localhost' && realmOverride) {
    return realmOverride;
  }

  const region = getRegionNameByHostName(hostname);
  if (isTest || !region) {
    return DEFAULT_REALM;
  }
  return getRealmByRegion(region) || DEFAULT_REALM;
};

export const memoizedGetCurrentRealm = memoizeOne(getRealmForHostname);

/**
 * @deprecated import { currentRealm } from 'dope-commons'
 */
export const currentRealm = memoizedGetCurrentRealm({
  isTest,
  hostname: window.location.hostname,
  realmOverride: CURRENT_REALM_OVERRIDE,
});

/**
 * @deprecated import { getCurrentRealm } from 'dope-commons'
 */
export const getCurrentRealm = () => currentRealm;

/**
 * @deprecated import { isONSR } from 'dope-commons'
 *
 * Whether or not the given realm is an ONSR realm.
 * @param realm
 *
 * We treat any realm that's not in the known commercial realm list like:
 * If we call isONSR('oc5') in oc1 dope, we would want it to return true
 * even if 'oc5' is not returned by RAD because it was disconnected
 */
export const isONSR = (realm: REALM) => !COMM_REALMS.includes(realm);

/**
 * @deprecated import { isSovereign } from 'dope-commons'
 */
export const isSovereign = (realm: REALM) => SOVEREIGN_REALMS.includes(realm);

/**
 * @deprecated import { isCurrentRealmONSR } from 'dope-commons'
 */
export const isCurrentRealmONSR = isONSR(currentRealm);

/**
 * @deprecated import { isCurrentRealmSovereign } from 'dope-commons'
 */
export const isCurrentRealmSovereign = isSovereign(currentRealm);

/**
 * OC4 is mini-prod stack, which only have security central and lumberjack supported.
 * https://devops.oci.oraclecorp.com/runbooks/DOPE/dope-how-to-s/dope-endpoints
 */
export const isOC4 = (realm: REALM) => realm === REALM.oc4;

export const isCurrentRealmOC4 = isOC4(currentRealm);

/**
 * @deprecated import { toPublicRegionName } from 'dope-commons'
 */
export const toPublicRegionName = (rs: RegionSummary) => rs.publicRegionName;

/**
 * @deprecated import { getCurrentRegionName } from 'dope-commons'
 */
export const getCurrentRegionName = (
  hostname: string,
  defaultRegionName: string,
) => {
  if (hostname === 'localhost') {
    // When overriding currentRealm in localhost, "DEFAULT_REGION" changes accordingly as well
    // So we don't need to specify an override here, instead, just use the value of defaultRegion.
    return defaultRegionName;
  }

  return getRegionNameByHostName(hostname) || defaultRegionName;
};

/**
 * @deprecated import { getEarlyRegions } from 'dope-commons'
 */
export const getEarlyRegions = (): Region[] => {
  return ALL_REGIONS.filter(
    (region) =>
      region.publicRegionName === EarlyRegions.iad ||
      region.publicRegionName === EarlyRegions.sea ||
      region.publicRegionName === EarlyRegions.phx,
  );
};

/**
 * @deprecated import { findEarlyRegion } from 'dope-commons'
 */
export const findEarlyRegion = (regionId: string): Region | undefined => {
  return getEarlyRegions().find(
    (region) =>
      region.publicRegionName === regionId ||
      region.alias === regionId ||
      region.dns === regionId,
  );
};

/**
 * @deprecated import { getEarlyRegionNameByObsoleteDesignation } from 'dope-commons'
 */
export const getEarlyRegionNameByObsoleteDesignation = (
  obsoleteDesignation: string,
) => {
  return (
    findEarlyRegion(obsoleteDesignation)?.publicRegionName ??
    obsoleteDesignation
  );
};

/**
 * @deprecated import { getDnsSuffixForRegion } from 'dope-commons'
 */
export const getDnsSuffixForRegion = (region: string) => {
  if (region === 'integ-next-1' || region === 'integ-stable-1') {
    return 'aka.r0';
  }
  const regionId = region.replace(/^(.*)-ad-.*$/, '$1');
  return findEarlyRegion(regionId)?.dns ?? region;
};

/**
 * @deprecated import { getAirportCodeForEarlyRegion } from 'dope-commons'
 */
export const getAirportCodeForEarlyRegion = (region: string) => {
  return findEarlyRegion(region)?.alias ?? region;
};

/**
 * @deprecated import { getEarlyRegionNameByAirportCode } from 'dope-commons'
 */
export const getEarlyRegionNameByAirportCode = (alias: string) => {
  return findEarlyRegion(alias)?.publicRegionName ?? alias;
};

/**
 * @deprecated import { getRegionNameForIdentityApis } from 'dope-commons'
 */
export const getRegionNameForIdentityApis = (regionPublicName: string) => {
  switch (regionPublicName) {
    case 'us-seattle-1':
    case 'us-phoenix-1':
      return findEarlyRegion(regionPublicName)?.alias ?? regionPublicName;
    default:
      return regionPublicName;
  }
};

// TODO: we already have a hook called useFindRegion
/**
 * @deprecated import { getRegionByRegionId } from 'dope-commons'
 */
export const getRegionByRegionId = (regionId: string): Region => {
  return (
    ALL_REGIONS.find((region) => {
      return (
        region.dns === regionId ||
        region.dnsUpdated == regionId ||
        region.alias === regionId
      );
    }) || ALL_REGIONS[0]
  );
};

/**
 * @deprecated import { getRegionOciIaasDomainName } from 'dope-commons'
 */
export const getRegionOciIaasDomainName = (regionPublicName: string) => {
  return ALL_REGIONS.find(
    (region) => region.publicRegionName === regionPublicName,
  )?.ociIaasDomainName;
};

/**
 * @deprecated import { getRegionsByRealm } from 'dope-commons'
 */
export const getRegionsByRealm = (realm: string): Region[] =>
  REGIONS.filter((r) => r.realm === realm);

/**
 * @deprecated import { getDefaultRegionByRealm } from 'dope-commons'
 */
export const getDefaultRegionByRealm = (realm: string): Region => {
  const regionsInRealm = getRegionsByRealm(realm);
  const defaultRegionInRealm =
    realm === REALM.oc1
      ? regionsInRealm.find((r) => r.alias === 'iad') ?? regionsInRealm[0]
      : regionsInRealm[0];

  return defaultRegionInRealm || defaultRegionIdMapping[REALM.oc1];
};

/**
 * @deprecated import { DEFAULT_REGION } from 'dope-commons'
 */
export const DEFAULT_REGION = getDefaultRegionByRealm(currentRealm);

/**
 * @deprecated import { currentDefaultRegion } from 'dope-commons'
 */
export const currentDefaultRegion = getCurrentRegionName(
  window.location.hostname,
  DEFAULT_REGION.dns,
);

/**
 * @deprecated import { toRealm } from 'dope-commons'
 */
export const toRealm = (r: string): REALM => {
  switch (r.toLocaleLowerCase()) {
    case 'region1':
      return REALM.region1;
    case 'oc1':
      return REALM.oc1;
    case 'oc2':
      return REALM.oc2;
    case 'oc3':
      return REALM.oc3;
    case 'oc4':
      return REALM.oc4;
    case 'oc5':
      return REALM.oc5;
    case 'oc6':
      return REALM.oc6;
    case 'oc7':
      return REALM.oc7;
    case 'oc8':
      return REALM.oc8;
    case 'oc9':
      return REALM.oc9;
    case 'oc10':
      return REALM.oc10;
    case 'oc11':
      return REALM.oc11;
    case 'oc12':
      return REALM.oc12;
    case 'oc19':
      return REALM.oc19;
    default:
      return REALM.oc1;
  }
};

/**
 * @deprecated import { regionSummaryToRegion } from 'dope-commons'
 */
export const regionSummaryToRegion = (rs: RegionSummary): Region => {
  return {
    alias: rs.airportCode,
    adPrefix: rs.airportCode,
    ads: rs.ads?.map((ad) => ad.toString()) ?? [],
    dns: rs.internalName ?? rs.publicRegionName,
    dnsUpdated:
      rs.publicRegionName === 'us-phoenix-1' ? rs.publicRegionName : undefined,
    realm: toRealm(rs.realm),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isProd: rs.state === 'Production',
    publicDomainName: rs.publicDomainName,
    iaasDomainName: rs.iaasDomainName,
    publicRegionName: rs.publicRegionName,
    state: rs.state,
  };
};

/**
 * @deprecated import { toDisplayName } from 'dope-commons'
 */
const toDisplayName = (region: Region, ad: AD | string) => {
  if (ad === AD.ALL_ADS) {
    return `${region.dns} (${ad})`;
  }
  return `${region.dns}-ad-${ad}`;
};

/**
 * @deprecated import { AD } from 'dope-commons'
 */
export const toAdList = (region: Region): AvailabilityDomain[] => {
  const propertiesFromRegion = _.pick(region, ['alias', 'realm', 'dnsUpdated']);
  const allAds = {
    ...propertiesFromRegion,
    name: region.dns,
    region: region.dns,
    ad: AD.ALL_ADS,
    state: region.state,
    displayName: toDisplayName(region, AD.ALL_ADS),
  };
  if (region.ads.length === 1) {
    return [
      {
        ...allAds,
        ad: AD.AD_1,
        singleAdRegion: true,
        displayName: toDisplayName(region, AD.AD_1),
      },
    ];
  }
  const ads = region.ads.map((ad, __, ads) => ({
    ad,
    ...propertiesFromRegion,
    name: `ad${ad}`,
    region: region.dns,
    displayName: toDisplayName(region, ad),
    alias: `${region.alias}-ad-${ad}`,
    singleAdRegion: ads.length === 1,
  }));
  return [{ ...allAds, singleAdRegion: false }, ...ads];
};

/**
 * @deprecated import { allowedRegionDNS } from 'dope-commons'
 *
 * List of region DNS in the allowed realms.
 */
export const allowedRegionDNS = REGIONS.map((r) => r.dnsUpdated ?? r.dns);

/**
 * @deprecated import { ADS_WITH_ALL } from 'dope-commons'
 */
export const ADS_WITH_ALL: AvailabilityDomain[] = REGIONS.map(toAdList).flatMap(
  (ad) => ad,
);

/**
 * @deprecated import { REALMS_INFO } from 'dope-commons'
 */
export const REALMS: Realm[] = REGIONS.reduce(
  (accumulator: Realm[], currentRegion: Region) => {
    let currentRealm = accumulator.find(
      (realm) => realm.alias === currentRegion.realm,
    );
    if (!currentRealm) {
      currentRealm = {
        regions: [],
        alias: currentRegion.realm,
      };
      accumulator.push(currentRealm);
    }
    currentRealm.regions.push(currentRegion);
    return accumulator;
  },
  [],
);

/**
 * @deprecated import { regionMap } from 'dope-commons'
 *
 * An object with the region alias as the key, and region details as the value.
 */
export const regionMap: { [key: string]: Region } = REGIONS.reduce(
  (map: { [key: string]: Region }, r: Region) => {
    map[r.alias] = r;

    return map;
  },
  {},
);

/**
 * @deprecated import { getT2RegionByAlias } from 'dope-commons'
 *
 * Get t2 region given a region alias
 * e.g., 'sea' => 'r1'
 * @param alias
 */
export const getT2RegionByAlias = (alias: string): string => {
  const region: Region = regionMap[alias];

  return region ? region.dns : '';
};

/**
 * @deprecated import { getIdentityRegionByAlias } from 'dope-commons'
 */
export const getIdentityRegionByAlias = (publicRegionName: string) => {
  if (IDENTITY_AIRPORT_CODE_REGIONS.has(publicRegionName)) {
    return getAirportCodeForEarlyRegion(publicRegionName);
  }
  return publicRegionName;
};

/**
 * @deprecated import { getAdPrefixByAlias } from 'dope-commons'
 *
 * Get adPrefix given a region alias
 * e.g., 'sea' => 'sea'
 * @param alias
 */
export const getAdPrefixByAlias = (alias: string): string => {
  const region: Region = regionMap[alias];

  // If defined, `adPrefix` takes precedence.
  return region ? region.adPrefix || region.dns : '';
};

/**
 * @deprecated import { getRealmForOcid } from 'dope-commons'
 */
export const getRealmForOcid = (ocid: string): Realm | undefined => {
  let realmMaybe = ocid.split('.')[2];
  if (realmMaybe === 'region1') {
    realmMaybe = 'r1';
  }
  return REALMS.find((realm) => realm.alias === realmMaybe);
};

export const allRegions: string[] = REGIONS.map(
  (regionDetails: Region) => regionDetails.dns,
);

/**
 * @deprecated import { isProduction } from 'dope-commons'
 */
export const isProduction = (r: RegionSummary) =>
  r.state?.toLowerCase() === RegionState.Production.toLowerCase();

/**
 * @deprecated import { isBuilding } from 'dope-commons'
 */
export const isBuilding = (r: RegionSummary) =>
  r.state?.toLowerCase() === RegionState.Building.toLowerCase();

/**
 * @deprecated import { getSummaryByRealm } from 'dope-commons'
 */
const getSummaryByRealm = (realm: string) => {
  return ALL_REALMS_WITH_SUMMARY.find((r) => {
    return r.name.toLocaleLowerCase() === realm.toLocaleLowerCase();
  });
};

/**
 * @deprecated import { constructJiraURLByRealm } from 'dope-commons'
 */
export const constructJiraURLByRealm = (realm: string) => {
  const summaryByRealm = getSummaryByRealm(realm);
  const firstRegionSummary = summaryByRealm?.firstRegionSummary;

  if (realm === REALM.oc2 || realm === REALM.oc3 || realm === REALM.oc4) {
    return `https://jira-sd.${firstRegionSummary?.publicRegionName}.${firstRegionSummary?.iaasDomainName}`;
  }

  if (realm === REALM.oc22) {
    return `https://jira-sd.${firstRegionSummary?.publicRegionName}.oci.${firstRegionSummary?.iaasDomainName}`;
  }

  if (
    summaryByRealm?.isDisconnected ||
    summaryByRealm?.isSovereign ||
    summaryByRealm?.realmType === realmType.government
  ) {
    return firstRegionSummary?.state?.toLowerCase() ===
      RegionState.Building.toLowerCase()
      ? JIRA_SD_URL_BASE
      : `https://jira-sd.${firstRegionSummary?.publicRegionName}.oci.${firstRegionSummary?.iaasDomainName}`;
  }

  return JIRA_SD_URL_BASE;
};
