import { inject, injectable } from 'inversify';
import { Symbols } from '@/config/symbols';
import { UseCase } from '@/application/shared';
import { User } from '@/domain/entities';
import type { AuthRepository } from '@/domain/repositories';

@injectable()
export class GetUser implements UseCase<Promise<User>> {
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(Symbols.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.authRepository = authRepository;
  }

  public async execute(): Promise<User> {
    return await this.authRepository.getUser();
  }
}
