import { inject, injectable } from 'inversify';
import { Symbols } from '@/config/symbols';
import { UseCase } from '@/application/shared';
import type { AuthRepository } from '@/domain/repositories';

export type ResetPasswordParams = [
  email: string,
  token: string,
  password: string,
  passwordConfirmation: string,
];

@injectable()
export class ResetPassword implements UseCase<Promise<true>, ResetPasswordParams> {
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(Symbols.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.authRepository = authRepository;
  }

  public async execute(
    email: string,
    token: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<true> {
    await this.authRepository.resetPassword(email, token, password, passwordConfirmation);

    return true;
  }
}
