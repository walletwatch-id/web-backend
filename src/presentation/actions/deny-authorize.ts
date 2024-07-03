'use server';

import { DenyAuthorize } from '@/application/server';
import { serverContainer } from '@/server-injection';
import { Symbols } from '@/config/symbols';

export async function denyAuthorize(
  state: string,
  clientId: string,
  authToken: string,
): Promise<string> {
  const deny = serverContainer.get<DenyAuthorize>(Symbols.DenyAuthorize);

  const response = await deny.execute(state, clientId, authToken);

  return response.redirect;
}
