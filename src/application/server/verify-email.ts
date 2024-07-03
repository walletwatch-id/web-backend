import { inject, injectable } from 'inversify';
import { Symbols } from '@/config/symbols';
import { UseCase } from '@/application/shared';
import type { AuthRepository } from '@/domain/repositories';

export type VerifyEmailParams = [id: string, hash: string, expires: number, signature: string];

@injectable()
export class VerifyEmail implements UseCase<Promise<true>, VerifyEmailParams> {
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(Symbols.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    hash: string,
    expires: number,
    signature: string,
  ): Promise<true> {
    await this.authRepository.verifyEmail(id, hash, expires, signature);

    return true;
  }
}
