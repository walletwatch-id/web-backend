import { Client } from '@/domain/entities';
import { DateTime } from 'luxon';

export interface ClientUIDto {
  id: string;
  userId: string;
  name: string;
  provider: string;
  redirect: string;
  personalAccessClient: boolean;
  passwordClient: boolean;
  revoked: boolean;
  createdAt: string;
  updatedAt: string;
}

export class ClientUIMapper {
  public static fromDomain(client: Client): ClientUIDto {
    return {
      id: client.id,
      userId: client.userId,
      name: client.name,
      provider: client.provider,
      redirect: client.redirect,
      personalAccessClient: client.personalAccessClient,
      passwordClient: client.passwordClient,
      revoked: client.revoked,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    };
  }

  public static toDomain(dto: ClientUIDto): Client {
    return new Client(
      dto.id,
      dto.userId,
      dto.name,
      dto.provider,
      dto.redirect,
      dto.personalAccessClient,
      dto.passwordClient,
      dto.revoked,
      DateTime.fromISO(dto.createdAt).toJSDate(),
      DateTime.fromISO(dto.updatedAt).toJSDate(),
    );
  }
}
