import { inject, injectable } from 'inversify';
import { Symbols } from '@/config/symbols';
import { UseCase } from '@/application/shared';
import type { AuthRepository } from '@/domain/repositories';

export type RegisterParams = [
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string,
  picture?: Blob,
];

@injectable()
export class Register implements UseCase<Promise<true>, RegisterParams> {
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(Symbols.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.authRepository = authRepository;
  }

  public async execute(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    picture?: Blob,
  ): Promise<true> {
    await this.authRepository.register(name, email, password, passwordConfirmation, picture);

    return true;
  }
}
