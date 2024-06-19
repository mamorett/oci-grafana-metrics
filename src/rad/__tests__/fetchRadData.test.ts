import * as instrumentation from '@src/common/instrumentation/Instrumentation';
import { testRealms } from 'common/components/__tests__/Realms.fixtures';
import { testRegions } from 'common/components/__tests__/Regions.fixtures';

describe('fetchRadData', () => {
  const mockedFetch: jest.Mock<() => any> = jest.fn();
  const fetchRadRegions = async () =>
    await require('../fetchRadData').fetchRadRegions();
  const fetchRadRealms = async () =>
    await require('../fetchRadData').fetchRadRealms();
  const fetchLocalServices = async () =>
    await require('../fetchRadData').fetchLocalServices();

  beforeEach(() => {
    jest.dontMock('rad/fetchRadData');
    jest.resetAllMocks();
    window.fetch = mockedFetch;
  });

  describe('fetchRadRegions', () => {
    it('Should return regions json if the call goes through', async () => {
      expect.assertions(1);
      const mockedJson = jest.fn();
      mockedJson.mockReturnValue(testRegions);
      mockedFetch.mockResolvedValue({ ok: true, json: mockedJson });

      const regions = await fetchRadRegions();
      expect(regions).toEqual(testRegions);
    });

    it('Should error out if the fetch result does not have ok status', async () => {
      mockedFetch.mockResolvedValue({ ok: false });

      await expect(fetchRadRegions()).rejects.toThrow();
    });

    it('Should error out if the fetch result does not have ok status', async () => {
      mockedFetch.mockResolvedValue({ status: 401 });

      await expect(fetchRadRegions()).rejects.toThrow();
    });
  });

  describe('fetchRadRealms', () => {
    it('Should return realms json if the call goes through', async () => {
      expect.assertions(1);
      const mockedJson = jest.fn();
      mockedJson.mockReturnValue(testRealms);
      mockedFetch.mockResolvedValue({ ok: true, json: mockedJson });

      const realms = await fetchRadRealms();
      expect(realms).toEqual(testRealms);
    });

    it('Should error out if the fetch result does not have ok status', async () => {
      mockedFetch.mockResolvedValue({ ok: false });

      await expect(fetchRadRealms()).rejects.toThrow();
    });

    it('Should error out if the fetch result returns 4xx status code', async () => {
      mockedFetch.mockResolvedValue({ status: 401 });

      await expect(fetchRadRealms()).rejects.toThrow();
    });
  });

  describe('instrumentation cases', () => {
    it.each([
      ['local services', fetchLocalServices],
      ['rad regions', fetchRadRegions],
      ['rad realms', fetchRadRealms],
    ])('records counter on %s call', async (_, fetchRadData) => {
      const mockTiming = jest.spyOn(instrumentation, 'recordTiming');
      const mockedJson = jest.fn();
      mockedJson.mockReturnValue(testRegions);
      mockedFetch.mockResolvedValue({ ok: true, json: mockedJson });

      await fetchRadData();
      expect(mockTiming).toHaveBeenCalledTimes(1);
    });
    it.each([
      ['local services', fetchLocalServices],
      ['rad regions', fetchRadRegions],
      ['rad realms', fetchRadRealms],
    ])(
      'records error counter when %s throws an error',
      async (_, fetchRadData) => {
        const mockTiming = jest.spyOn(instrumentation, 'recordTiming');
        const mockCounter = jest.spyOn(instrumentation, 'recordCounter');
        mockedFetch.mockResolvedValue({ status: 401 });

        await expect(fetchRadData()).rejects.toThrow();
        expect(mockTiming).toHaveBeenCalledTimes(1);
        expect(mockCounter).toHaveBeenCalledTimes(1);
      },
    );
  });
});
