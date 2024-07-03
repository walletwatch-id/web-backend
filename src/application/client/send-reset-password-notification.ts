import { inject, injectable } from 'inversify';
import { Symbols } from '@/config/symbols';
import { UseCase } from '@/application/shared';
import type { AuthRepository } from '@/domain/repositories';

export type SendResetPasswordNotificationParams = [email: string];

@injectable()
export class SendResetPasswordNotification
  implements UseCase<Promise<true>, SendResetPasswordNotificationParams>
{
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(Symbols.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.authRepository = authRepository;
  }

  public async execute(email: string): Promise<true> {
    await this.authRepository.sendResetPasswordNotification(email);

    return true;
  }
}
