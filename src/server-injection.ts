import 'reflect-metadata';
import {
  ApproveAuthorize,
  Authorize,
  DenyAuthorize,
  GetUser,
  VerifyEmail,
} from '@/application/server';
import { AuthRepository } from '@/domain/repositories';
import { AuthRepositoryImpl } from '@/infrastructure/repositories';
import { cookies } from 'next/headers';
import { Container } from 'inversify';
import { Symbols } from '@/config/symbols';
import {
  WalletWatchApiDataSource,
  walletWatchApiDataSourceServerImpl,
} from '@/infrastructure/datasources/server';
import { serialize } from 'cookie';

export const serverContainer = new Container();

// Use cases
serverContainer.bind<VerifyEmail>(Symbols.VerifyEmail).to(VerifyEmail);
serverContainer.bind<GetUser>(Symbols.GetUser).to(GetUser);
serverContainer.bind<Authorize>(Symbols.Authorize).to(Authorize);
serverContainer.bind<ApproveAuthorize>(Symbols.ApproveAuthorize).to(ApproveAuthorize);
serverContainer.bind<DenyAuthorize>(Symbols.DenyAuthorize).to(DenyAuthorize);

// Repositories
serverContainer.bind<AuthRepository>(Symbols.AuthRepository).to(AuthRepositoryImpl);

// Data sources
serverContainer
  .bind<WalletWatchApiDataSource>(Symbols.WalletWatchApiDataSource)
  .toDynamicValue(() => {
    const dataSource = walletWatchApiDataSourceServerImpl;
    dataSource.interceptors.request.use((config) => {
      const parsedCookies = cookies().getAll();
      const serializedCookies = parsedCookies.map((cookie) => serialize(cookie.name, cookie.value));
      config.headers.Cookie = serializedCookies;
      return config;
    });
    return dataSource;
  });
