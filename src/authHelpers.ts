import { getCurrentRegionName } from './regionUtils';
import { radRealms } from 'rad/fetchRadData';
import { REALM, defaultRegionIdMapping } from 'region_constants';

export interface RegionsByRealm {
  [realm: string]: string;
}

export type Realm = Extract<keyof RegionsByRealm, string>;

export const getRegionNameForSoupUrl = (
  regionsList: string[] | undefined,
  defaultRegionName: string,
) => {
  const currentDefaultRegion = getCurrentRegionName(
    window.location.hostname,
    defaultRegionName,
  );

  let matchedRegion: string | undefined;
  regionsList &&
    regionsList.forEach((r) => {
      if (r === currentDefaultRegion) {
        matchedRegion = r;
      }
    });

  if (!matchedRegion) {
    return defaultRegionName;
  }

  return matchedRegion;
};

const isNotDynamicallyLoadedRealm = (realm: string) => {
  return (
    realm === REALM.oc1 ||
    realm === REALM.oc2 ||
    realm === REALM.oc3 ||
    realm === REALM.oc4
  );
};

export const loadRegionsByRealmInto = async (
  regionsByRealm: RegionsByRealm,
) => {
  (await radRealms).forEach((r) => {
    const realm = r.name;
    const {
      publicRegionName,
      ociPublicDomainName,
      iaasDomainName,
      publicDomainName,
    } = r.firstRegionSummary;

    if (realm === REALM.region1) {
      regionsByRealm[
        realm
      ] = `${defaultRegionIdMapping.region1}.${iaasDomainName}`;
    } else if (isNotDynamicallyLoadedRealm(realm)) {
      regionsByRealm[
        realm
      ] = `${defaultRegionIdMapping[realm]}.${publicDomainName}`;
    } else {
      const regionForSoupUrl = getRegionNameForSoupUrl(
        r.regions,
        publicRegionName,
      );

      regionsByRealm[realm] = `${regionForSoupUrl}.${ociPublicDomainName}`;
    }
  });
};

export const getRealms = async (realmList: Realm[]) => {
  const byName = (realm1: string, realm2: string) => {
    if (realm1.startsWith('oc') && realm2.startsWith('r')) {
      return 1;
    }

    if (realm1.startsWith('r') && realm2.startsWith('oc')) {
      return -1;
    }

    const index1 = parseInt(realm1.replace(/[^0-9]/g, ''));
    const index2 = parseInt(realm2.replace(/[^0-9]/g, ''));

    return index1 < index2 ? -1 : 1;
  };
  (await radRealms).forEach((r) => realmList.push(r.name));
  realmList.sort(byName);
};
