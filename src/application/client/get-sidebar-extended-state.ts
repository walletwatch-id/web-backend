import { inject, injectable } from 'inversify';
import { Symbols } from '@/config/symbols';
import { UseCase } from '@/application/shared';
import type { ClientRepository } from '@/domain/repositories';

@injectable()
export class GetSidebarExtendedState implements UseCase<boolean> {
  private readonly clientRepository: ClientRepository;

  public constructor(
    @inject(Symbols.ClientRepository)
    clientRepository: ClientRepository,
  ) {
    this.clientRepository = clientRepository;
  }

  public execute(): boolean {
    return this.clientRepository.getSidebarExtendedState();
  }
}
