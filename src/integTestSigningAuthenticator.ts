import { TokenAuthenticator } from 'duplo-authentication';
import { createAuthorizedRequest } from './subtleAuthenticator';

export const integTestAuthenticator = ({
  getExpiration: () => Promise.resolve(Date.now() + 1000 * 60 * 60 * 10),
  isSessionActive: () => true,
  tryRefreshToken: () => Promise.resolve(),
  createAuthorizedRequest: async (request: Request): Promise<Request> =>
    await createAuthorizedRequest(request),
} as unknown) as TokenAuthenticator;
