// WARNING: do not import any region info in this file!
import {
  RealmSummary,
  RegionSummary,
} from '@clients/devops-ui-service-api-client';
import {
  recordCounter,
  recordTiming,
} from 'common/instrumentation/Instrumentation';

const LOCAL_SERVICES = 'local_services';
const RAD_REGIONS = 'rad_regions';
const RAD_REALMS = 'rad_realms';

const fetchData = async (fileName: string) => {
  const radDataUrl = `/data/rad/${fileName}.json`;
  const startTime = Date.now();
  try {
    const r = await fetch(radDataUrl);
    if (!r.ok) {
      recordTiming(`dope.${fileName}.Latency`, Date.now() - startTime);
      recordCounter(`dope.${fileName}.Fail`);
      throw new Error(`Failed to fetch ${radDataUrl}`);
    }
    recordTiming(`dope.${fileName}.Latency`, Date.now() - startTime);
    return r.json();
  } catch (error) {
    throw error;
  }
};

export const fetchLocalServices = () => fetchData(LOCAL_SERVICES);
export const fetchRadRegions = (): Promise<RegionSummary[]> => {
  return fetchData(RAD_REGIONS);
};
export const fetchRadRealms = (): Promise<RealmSummary[]> => {
  return fetchData(RAD_REALMS);
};

export const localServices = fetchLocalServices();
export const radRealms = fetchRadRealms();
export const radRegions = fetchRadRegions();
