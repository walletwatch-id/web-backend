import { inject, injectable } from 'inversify';
import { Symbols } from '@/config/symbols';
import { UseCase } from '@/application/shared';
import type { AuthRepository } from '@/domain/repositories';

@injectable()
export class Logout implements UseCase<Promise<true>> {
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(Symbols.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.authRepository = authRepository;
  }

  public async execute(): Promise<true> {
    await this.authRepository.logout();

    return true;
  }
}
