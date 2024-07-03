import { AuthorizePrompt, AuthorizeRedirect } from '@/domain/entities';
import { inject, injectable } from 'inversify';
import { Symbols } from '@/config/symbols';
import { UseCase } from '@/application/shared';
import type { AuthRepository } from '@/domain/repositories';

export type AuthorizeParams = [params: URLSearchParams];

@injectable()
export class Authorize
  implements UseCase<Promise<AuthorizePrompt | AuthorizeRedirect>, AuthorizeParams>
{
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(Symbols.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.authRepository = authRepository;
  }

  public async execute(params: URLSearchParams): Promise<AuthorizePrompt | AuthorizeRedirect> {
    return await this.authRepository.authorize(params);
  }
}
