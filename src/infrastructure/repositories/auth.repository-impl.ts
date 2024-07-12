import type { WalletWatchApiDataSource } from '@/infrastructure/datasources/server';
import { AuthRepository } from '@/domain/repositories';
import { AxiosError } from 'axios';
import { AuthorizePrompt, AuthorizeRedirect, User } from '@/domain/entities';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  HttpError,
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  SessionExpiredError,
  UnauthorizedError,
  UnprocessableEntityError,
} from '@/domain/errors';
import { inject, injectable } from 'inversify';
import { Symbols } from '@/config/symbols';
import { ClientInfraMapper, ScopeInfraMapper, UserInfraMapper } from '@/infrastructure/dtos';

@injectable()
export class AuthRepositoryImpl implements AuthRepository {
  private readonly apiDataSource: WalletWatchApiDataSource;

  public constructor(
    @inject(Symbols.WalletWatchApiDataSource)
    apiDataSource: WalletWatchApiDataSource,
  ) {
    this.apiDataSource = apiDataSource;
  }
  private async withErrorHandler<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status && error.response.status < 500) {
          const { message, ...data } = error.response.data.data ?? { message: error.message };
          switch (error.response.status) {
            case 400:
              throw new BadRequestError(message, data);
            case 401:
              throw new UnauthorizedError(message, data);
            case 403:
              throw new ForbiddenError(message, data);
            case 404:
              throw new NotFoundError(message, data);
            case 405:
              throw new MethodNotAllowedError(message, data);
            case 409:
              throw new ConflictError(message, data);
            case 419:
              throw new SessionExpiredError(message, data);
            case 422:
              throw new UnprocessableEntityError(message, data);
            default:
              throw new HttpError(error.response.status, message, data);
          }
        } else {
          const message = error.response?.data?.message;
          const data = error.response?.data?.data;
          switch (error.response?.status) {
            case 500:
              throw new InternalServerError(message, data);
            default:
              throw new HttpError(error.response?.status ?? 500, message, data);
          }
        }
      } else {
        throw error;
      }
    }
  }

  public async register(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    picture?: File,
  ): Promise<void> {
    const _token = await this.getCsrfToken();

    const data = new FormData();
    data.append('name', name);
    data.append('email', email);
    data.append('password', password);
    data.append('password_confirmation', passwordConfirmation);
    if (picture) {
      data.append('picture', picture);
    }
    data.append('_token', _token);

    await this.withErrorHandler(() => this.apiDataSource.post('/auth/register', data));
  }

  public async login(email: string, password: string): Promise<void> {
    const _token = await this.getCsrfToken();

    await this.withErrorHandler(() =>
      this.apiDataSource.post('/auth/login', { email, password, _token }),
    );
  }

  public async logout(): Promise<void> {
    await this.getCsrfToken();

    await this.withErrorHandler(() => this.apiDataSource.post('/auth/logout'));
  }

  public async sendResetPasswordNotification(email: string): Promise<void> {
    const _token = await this.getCsrfToken();

    await this.withErrorHandler(() =>
      this.apiDataSource.post('/auth/reset-password/notify', { email, _token }),
    );
  }

  public async resetPassword(
    email: string,
    token: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<void> {
    const _token = await this.getCsrfToken();

    await this.withErrorHandler(() =>
      this.apiDataSource.post('/auth/reset-password', {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
        _token,
      }),
    );
  }

  public async sendVerifyEmailNotification(): Promise<void> {
    await this.withErrorHandler(() => this.apiDataSource.post('/auth/verify-email/notify'));
  }

  public async verifyEmail(
    id: string,
    hash: string,
    expires: number,
    signature: string,
  ): Promise<void> {
    const _token = await this.getCsrfToken();

    await this.withErrorHandler(() =>
      this.apiDataSource.post(
        `/auth/verify-email/${id}/${hash}`,
        {
          _token,
        },
        {
          params: {
            expires,
            signature,
          },
        },
      ),
    );
  }

  public async getUser(): Promise<User> {
    return await this.withErrorHandler(async () => {
      const response = await this.apiDataSource.get('/auth/user');

      return UserInfraMapper.toDomain(response.data?.data?.user);
    });
  }

  public async getCsrfToken(): Promise<string> {
    return await this.withErrorHandler(async () => {
      const response = await this.apiDataSource.get('/auth/token');

      return response.data?.data?.token;
    });
  }

  public authorize(params: URLSearchParams): Promise<AuthorizePrompt | AuthorizeRedirect> {
    return this.withErrorHandler(async () => {
      const response = await this.apiDataSource.get('/oauth2/_authorize', {
        params,
      });

      if (response.data?.data?.redirect) {
        return new AuthorizeRedirect(response.data?.data?.redirect);
      } else {
        const user = UserInfraMapper.toDomain(response.data?.data?.user);
        const client = ClientInfraMapper.toDomain(response.data?.data?.client);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const scopes = response.data?.data?.scopes.map((scope: any) =>
          ScopeInfraMapper.toDomain(scope),
        );
        const authToken = response.data?.data?.auth_token;

        return new AuthorizePrompt(user, client, scopes, authToken);
      }
    });
  }

  public async approveAuthorize(
    state: string,
    clientId: string,
    authToken: string,
  ): Promise<AuthorizeRedirect> {
    const _token = await this.getCsrfToken();

    return this.withErrorHandler(async () => {
      const response = await this.apiDataSource.post('/oauth2/_authorize', {
        state,
        client_id: clientId,
        auth_token: authToken,
        _token,
      });

      return new AuthorizeRedirect(response.data?.data?.redirect);
    });
  }

  public async denyAuthorize(
    state: string,
    clientId: string,
    authToken: string,
  ): Promise<AuthorizeRedirect> {
    const _token = await this.getCsrfToken();

    return this.withErrorHandler(async () => {
      const response = await this.apiDataSource.delete('/oauth2/_authorize', {
        data: {
          state,
          client_id: clientId,
          auth_token: authToken,
          _token,
        },
      });

      return new AuthorizeRedirect(response.data?.data?.redirect);
    });
  }
}
