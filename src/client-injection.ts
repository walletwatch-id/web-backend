'use client';

import 'reflect-metadata';
import { AuthRepository, ClientRepository } from '@/domain/repositories';
import { AuthRepositoryImpl, ClientRepositoryImpl } from '@/infrastructure/repositories';
import { Container } from 'inversify';
import {
  GetSidebarExtendedState,
  Login,
  Logout,
  Register,
  ResetPassword,
  SendResetPasswordNotification,
  SendVerifyEmailNotification,
  SetSidebarExtendedState,
} from '@/application/client';
import {
  LocalStorageDataSource,
  LocalStorageDataSourceImpl,
  SessionStorageDataSource,
  SessionStorageDataSourceImpl,
} from '@/infrastructure/datasources/client';
import { Symbols } from '@/config/symbols';
import {
  WalletWatchApiDataSource,
  walletWatchApiDataSourceClientImpl,
} from '@/infrastructure/datasources/server';

export const clientContainer = new Container();

// Use cases
clientContainer.bind<Register>(Symbols.Register).to(Register);
clientContainer.bind<Login>(Symbols.Login).to(Login);
clientContainer.bind<Logout>(Symbols.Logout).to(Logout);
clientContainer
  .bind<SendResetPasswordNotification>(Symbols.SendResetPasswordNotification)
  .to(SendResetPasswordNotification);
clientContainer.bind<ResetPassword>(Symbols.ResetPassword).to(ResetPassword);
clientContainer
  .bind<SendVerifyEmailNotification>(Symbols.SendVerifyEmailNotification)
  .to(SendVerifyEmailNotification);
clientContainer
  .bind<SetSidebarExtendedState>(Symbols.SetSidebarExtendedState)
  .to(SetSidebarExtendedState);
clientContainer
  .bind<GetSidebarExtendedState>(Symbols.GetSidebarExtendedState)
  .to(GetSidebarExtendedState);

// Repositories
clientContainer.bind<AuthRepository>(Symbols.AuthRepository).to(AuthRepositoryImpl);
clientContainer.bind<ClientRepository>(Symbols.ClientRepository).to(ClientRepositoryImpl);

// Data sources
clientContainer
  .bind<WalletWatchApiDataSource>(Symbols.WalletWatchApiDataSource)
  .toConstantValue(walletWatchApiDataSourceClientImpl);
clientContainer
  .bind<LocalStorageDataSource>(Symbols.LocalStorageDataSource)
  .to(LocalStorageDataSourceImpl);
clientContainer
  .bind<SessionStorageDataSource>(Symbols.SessionStorageDataSource)
  .to(SessionStorageDataSourceImpl);
