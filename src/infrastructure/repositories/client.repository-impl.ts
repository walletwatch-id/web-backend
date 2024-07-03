import type { SessionStorageDataSource } from '@/infrastructure/datasources/client';
import { inject, injectable } from 'inversify';
import { ClientRepository } from '@/domain/repositories';
import { Symbols } from '@/config/symbols';

@injectable()
export class ClientRepositoryImpl implements ClientRepository {
  private readonly sessionStorageDataSource: SessionStorageDataSource;

  public constructor(
    @inject(Symbols.SessionStorageDataSource)
    sessionStorageDataSource: SessionStorageDataSource,
  ) {
    this.sessionStorageDataSource = sessionStorageDataSource;
  }

  public getSidebarExtendedState(): boolean {
    return this.sessionStorageDataSource.get<boolean>('sidebar-extended') || false;
  }

  public setSidebarExtendedState(state: boolean): void {
    this.sessionStorageDataSource.set<boolean>('sidebar-extended', state);
  }
}
