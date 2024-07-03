import { inject, injectable } from 'inversify';
import { Symbols } from '@/config/symbols';
import { UseCase } from '@/application/shared';
import type { AuthRepository } from '@/domain/repositories';

export type LoginParams = [email: string, password: string];

@injectable()
export class Login implements UseCase<Promise<true>, LoginParams> {
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(Symbols.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.authRepository = authRepository;
  }

  public async execute(email: string, password: string): Promise<true> {
    await this.authRepository.login(email, password);

    return true;
  }
}
