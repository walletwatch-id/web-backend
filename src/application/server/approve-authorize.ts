import { AuthorizeRedirect } from '@/domain/entities';
import { inject, injectable } from 'inversify';
import { Symbols } from '@/config/symbols';
import { UseCase } from '@/application/shared';
import type { AuthRepository } from '@/domain/repositories';

export type ApproveAuthorizeParams = [state: string, clientId: string, authToken: string];

@injectable()
export class ApproveAuthorize
  implements UseCase<Promise<AuthorizeRedirect>, ApproveAuthorizeParams>
{
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(Symbols.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.authRepository = authRepository;
  }

  public async execute(
    state: string,
    clientId: string,
    authToken: string,
  ): Promise<AuthorizeRedirect> {
    return await this.authRepository.approveAuthorize(state, clientId, authToken);
  }
}
