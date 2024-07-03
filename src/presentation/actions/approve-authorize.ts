'use server';

import { ApproveAuthorize } from '@/application/server';
import { serverContainer } from '@/server-injection';
import { Symbols } from '@/config/symbols';

export async function approveAuthorize(
  state: string,
  clientId: string,
  authToken: string,
): Promise<string> {
  const approve = serverContainer.get<ApproveAuthorize>(Symbols.ApproveAuthorize);

  const response = await approve.execute(state, clientId, authToken);

  return response.redirect;
}
