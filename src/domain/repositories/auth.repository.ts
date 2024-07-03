import { AuthorizePrompt, AuthorizeRedirect, User } from '@/domain/entities';

export interface AuthRepository {
  register(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    picture?: Blob,
  ): Promise<void>;
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  sendResetPasswordNotification(email: string): Promise<void>;
  resetPassword(
    email: string,
    token: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<void>;
  sendVerifyEmailNotification(): Promise<void>;
  verifyEmail(id: string, hash: string, expires: number, signature: string): Promise<void>;
  getCsrfToken(): Promise<string>;
  getUser(): Promise<User>;
  authorize(params: URLSearchParams): Promise<AuthorizePrompt | AuthorizeRedirect>;
  approveAuthorize(state: string, clientId: string, authToken: string): Promise<AuthorizeRedirect>;
  denyAuthorize(state: string, clientId: string, authToken: string): Promise<AuthorizeRedirect>;
}
