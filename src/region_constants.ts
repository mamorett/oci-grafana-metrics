import {
  RegionSummary,
  RealmSummary,
} from '@clients/devops-ui-service-api-client';
import { bySortKey } from './common/utils/sort';

/**
 * @deprecated import { RealmInfo } from 'dope-commons'
 */
export interface Realm {
  alias: string;
  regions: Region[];
}

/**
 * @deprecated import { realmType } from 'dope-commons'
 */
export const realmType = {
  dedicated: 'dedicated',
  commercial: 'commercial',
  government: 'government',
  sovereign: 'sovereign',
} as const;

/**
 * @deprecated import { Region } from 'dope-commons'
 */
export interface Region {
  alias: string;
  adPrefix?: string;
  ads: string[];
  dns: string;
  realm: REALM;
  pops?: string[];
  dnsUpdated?: string;
  isDisconnected?: boolean;
  isSovereign?: boolean;
  realmFirstRegion?: string;
  isProd: boolean;
  publicDomainName?: string;
  iaasDomainName?: string;
  ociIaasDomainName?: string;
  publicRegionName: string;
  state?: string;
}

/**
 * @deprecated import { AvailabilityDomain } from 'dope-commons'
 */
export interface AvailabilityDomain
  extends Pick<Region, 'alias' | 'realm' | 'dnsUpdated'> {
  name: string;
  region: string;
  ad: string;
  singleAdRegion: boolean;
  displayName: string;
  state?: string;
}

/**
 * @deprecated import { TestAD } from 'dope-commons'
 */
export enum TestAD {
  dev_1 = 'dev-1',
  dev_3 = 'dev-3',
  integ_stable_1 = 'integ-stable-1',
  integ_next_1 = 'integ-next-1',
}

/**
 * @deprecated import { REALM } from 'dope-commons'
 */
export enum REALM {
  region1 = 'region1',
  oc1 = 'oc1',
  oc2 = 'oc2',
  oc3 = 'oc3',
  oc4 = 'oc4',
  oc5 = 'oc5',
  oc6 = 'oc6',
  oc7 = 'oc7',
  oc8 = 'oc8',
  oc9 = 'oc9',
  oc10 = 'oc10',
  oc11 = 'oc11',
  oc12 = 'oc12',
  oc14 = 'oc14',
  oc16 = 'oc16',
  oc17 = 'oc17',
  oc19 = 'oc19',
  oc20 = 'oc20',
  oc21 = 'oc21',
  oc22 = 'oc22',
}

/**
 * @deprecated import { RegionState } from 'dope-commons'
 */
export enum RegionState {
  Building = 'Building',
  Production = 'Production',
  Deprecated = 'Deprecated',
  None = 'None',
}

/**
 * @deprecated import { EarlyRegions } from 'dope-commons'
 */
export enum EarlyRegions {
  iad = 'us-ashburn-1',
  sea = 'us-seattle-1',
  phx = 'us-phoenix-1',
}

/**
 * @deprecated import { AD } from 'dope-commons'
 */
export enum AD {
  AD_1 = '1',
  AD_2 = '2',
  AD_3 = '3',
  ALL_ADS = 'All ADs',
}

/**
 * @deprecated import { devopsDnsPrefix } from 'dope-commons'
 */
export const devopsDnsPrefix = 'devops';

/**
 * @deprecated import { ociOracleCorpDns } from 'dope-commons'
 */
export const ociOracleCorpDns = 'oci.oraclecorp.com';

/**
 * @deprecated import { DEFAULT_REALM } from 'dope-commons'
 */
export const DEFAULT_REALM = REALM.oc1;

/**
 * @deprecated import { CURRENT_REALM_OVERRIDE } from 'dope-commons'
 */
export const CURRENT_REALM_OVERRIDE = REALM.oc1;

/**
 * @deprecated import { REGIONS } from 'dope-commons'
 *
 * Information of all regions, including the ONSR ones.
 */
export const ALL_REGIONS: Region[] = [];

/**
 * @deprecated import { REALMS_WITH_SUMMARY } from 'dope-commons'
 */
export const ALL_REALMS_WITH_SUMMARY: RealmSummary[] = [];

/**
 * @deprecated import { REGIONS } from 'dope-commons'
 *
 * Sourced from R2D2 API, but handled and served by devops-ui-service.
 * Dicsonnected regions are omitted by devops-ui-service.
 */
export const REGIONS: Region[] = ALL_REGIONS;

/**
 * @deprecated import { regionObsoleteDesignation } from 'dope-commons'
 */
export const regionObsoleteDesignation = {
  sea: 'r1',
  phx: 'r2',
} as const;

/**
 * @deprecated import { getObsoleteRegionDesignation } from 'dope-commons'
 */
export const getObsoleteRegionDesignation = (regionPublicName: string) => {
  switch (regionPublicName) {
    case 'us-seattle-1':
      return regionObsoleteDesignation.sea;
    case 'us-phoenix-1':
      return regionObsoleteDesignation.phx;
    default:
      return regionPublicName;
  }
};

/**
 * @deprecated import { defaultRegionIdMapping } from 'dope-commons'
 *
 * TODO: use shepherd/bo-peep to automate defaultRegionIdMapping and backupRegionIdMapping https://jira.oci.oraclecorp.com/browse/DOPE-6063
 */
export const defaultRegionIdMapping: { [realm: string]: string } = {
  region1: 'r1',
  oc1: 'us-ashburn-1',
  oc2: 'us-luke-1',
  oc3: 'us-gov-ashburn-1',
  oc4: 'uk-gov-cardiff-1',
  oc5: 'us-tacoma-1',
  oc6: 'us-gov-fortworth-1',
  oc7: 'us-gov-sterling-1',
  oc8: 'ap-chiyoda-1',
  oc9: 'me-dcc-muscat-1',
  oc10: 'ap-dcc-canberra-1',
  oc11: 'us-gov-fortworth-3',
  oc12: 'us-gov-phoenix-2',
};

/**
 * @deprecated import { AvailabilityDomain } from 'dope-commons'
 */
export const backupRegionIdMapping: { [realm: string]: string } = {
  oc1: 'us-phoenix-1',
  oc6: 'us-gov-sterling-2',
  oc11: 'us-gov-phoenix-3',
};

/**
 * @deprecated import { AvailabilityDomain } from 'dope-commons'
 */
export const grafanaBackupRegionIdMapping: { [realm: string]: string } = {
  oc1: 'us-ashburn-1',
  oc6: 'us-gov-sterling-2',
  oc11: 'us-gov-phoenix-3',
};

/**
 * @deprecated import { DEFAULT_REGION_SUMMARY } from 'dope-commons'
 */
let DEFAULT_REGION_SUMMARY: RegionSummary;

/**
 * @deprecated import { getDefaultRegionSummary } from 'dope-commons'
 */
export const getDefaultRegionSummary = () => {
  if (!DEFAULT_REGION_SUMMARY) {
    throw new Error(
      'No default region summary. There must have been an error fetching regions.',
    );
  }
  return DEFAULT_REGION_SUMMARY;
};

/**
 * @deprecated import { bootstrapAllRegions } from 'dope-commons'
 */
export const bootstrapAllRegions = (regions: RegionSummary[]) => {
  DEFAULT_REGION_SUMMARY =
    regions.find((r) => r.airportCode.toLowerCase() === 'iad') ?? regions[0];
  const sorted = [...regions].sort((a, b) => {
    const aOrder = sortOrder[a.airportCode] ?? Infinity;
    const bOrder = sortOrder[b.airportCode] ?? Infinity;

    if (aOrder === bOrder) {
      return bySortKey(a, b);
    }

    return aOrder - bOrder;
  });

  sorted.forEach((r) => {
    const region: Region = {
      alias: r.airportCode,
      ads: (r.ads || [1]).map((a) => `${a}`) as AD[],
      dns: r.internalName || r.publicRegionName,
      realm: r.realm as REALM,
      pops: r.pops?.map((pop) => `${pop}`),
      isDisconnected: r.isDisconnected,
      isSovereign: r.isSovereign,
      realmFirstRegion: r.realmFirstRegion,
      isProd: (r as any).state === 'Production',
      iaasDomainName: r.iaasDomainName,
      publicDomainName: r.publicDomainName,
      ociIaasDomainName: r.ociIaasDomainName,
      publicRegionName: r.publicRegionName,
    };

    // add some special cases for the OG regions
    switch (region.alias) {
      case 'sea':
        region.adPrefix = 'sea';
        break;
      case 'phx':
        region.adPrefix = 'phx';
        region.dnsUpdated = 'us-phoenix-1';
        break;
      case 'iad':
        region.adPrefix = 'iad';
        break;
      default:
        break;
    }

    ALL_REGIONS.push(region);
  });
};

/**
 * @deprecated import { bootstrapAllRealms } from 'dope-commons'
 */
export const bootstrapAllRealms = (realms: RealmSummary[]) => {
  realms.forEach((r) => {
    const realm: RealmSummary = {
      name: r.name,
      realmType: r.realmType,
      isDisconnected: r.isDisconnected,
      isSovereign: r.isSovereign,
      isTest: r.isTest,
      firstRegionSummary: r.firstRegionSummary,
      secondRegionSummary: r.secondRegionSummary,
      regions: r.regions,
    };

    ALL_REALMS_WITH_SUMMARY.push(realm);
  });
};

// enough pages and tests rely on the old sort order, so keep it around
const sortOrderList = [
  'sea',
  'phx',
  'iad',
  'fra',
  'lhr',
  'yyz',
  'icn',
  'nrt',
  'bom',
  'zrh',
  'gru',
  'syd',
  'ams',
  'jed',
  'kix',
  'mel',
  'yul',
  'hyd',
  'yny',
  'cwl',
  'sjc',
  'lfi',
  'luf',
  'ric',
  'pia',
  'tus',
  'ltn',
  'brs',
  'tiw',
  'ftw',
  'bwi',
  'nja',
  'dxb',
  'scl',
  'qdf',
  'dca',
];

const sortOrder = sortOrderList.reduce((order, alias, idx) => {
  order[alias] = idx;
  return order;
}, {} as { [alias: string]: number });

// These are the two regions that Identity uses airport codes for in the HAProxy config
export const IDENTITY_AIRPORT_CODE_REGIONS = new Set([
  'r1',
  'r2',
  'us-seattle-1',
  'us-phoenix-1',
]);
