import {
  LocalService,
  RegionSummary,
} from '@clients/devops-ui-service-api-client';
import { useEffect, useState } from 'react';
import { localServices, radRegions } from './fetchRadData';

export const useLocalServices = (): [
  LocalService[],
  { loadingServices: boolean },
] => {
  const [services, setServices] = useState<LocalService[]>([]);
  const [loadingServices, setLoading] = useState(true);
  useEffect(() => {
    const run = async () => {
      const s = await localServices;
      setServices(s);
      setLoading(true);
    };

    run();
  }, []);
  return [services, { loadingServices }];
};

export const useRegions = () => {
  const [regions, setRegions] = useState<RegionSummary[]>([]);
  useEffect(() => {
    const run = async () => {
      const r = await radRegions;
      setRegions(r);
    };

    run();
  }, []);
  return regions;
};
