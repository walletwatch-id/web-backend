import { inject, injectable } from 'inversify';
import { Symbols } from '@/config/symbols';
import { UseCase } from '@/application/shared';
import type { ClientRepository } from '@/domain/repositories';

export type SetSidebarExtendedStateParams = [state: boolean];

@injectable()
export class SetSidebarExtendedState implements UseCase<void, SetSidebarExtendedStateParams> {
  private readonly clientRepository: ClientRepository;

  public constructor(
    @inject(Symbols.ClientRepository)
    clientRepository: ClientRepository,
  ) {
    this.clientRepository = clientRepository;
  }

  public execute(state: boolean): void {
    this.clientRepository.setSidebarExtendedState(state);
  }
}
