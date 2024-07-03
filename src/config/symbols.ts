export const Symbols = {
  // Use cases
  Register: Symbol.for('Register'),
  Login: Symbol.for('Login'),
  Logout: Symbol.for('Logout'),
  SendResetPasswordNotification: Symbol.for('SendResetPasswordNotification'),
  ResetPassword: Symbol.for('ResetPassword'),
  SendVerifyEmailNotification: Symbol.for('SendVerifyEmailNotification'),
  VerifyEmail: Symbol.for('VerifyEmail'),
  GetUser: Symbol.for('GetUser'),
  Authorize: Symbol.for('Authorize'),
  ApproveAuthorize: Symbol.for('ApproveAuthorize'),
  DenyAuthorize: Symbol.for('DenyAuthorize'),
  SetSidebarExtendedState: Symbol.for('SetSidebarExtendedState'),
  GetSidebarExtendedState: Symbol.for('GetSidebarExtendedState'),

  // Repositories
  AuthRepository: Symbol.for('AuthRepository'),
  ClientRepository: Symbol.for('ClientRepository'),

  // Data sources
  LocalStorageDataSource: Symbol.for('LocalStorageDataSource'),
  SessionStorageDataSource: Symbol.for('SessionStorageDataSource'),
  WalletWatchApiDataSource: Symbol.for('WalletWatchApiDataSource'),
};
