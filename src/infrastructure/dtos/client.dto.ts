import { Client } from '@/domain/entities';
import { DateTime } from 'luxon';

export interface ClientInfraDto {
  id: string;
  user_id: string;
  name: string;
  provider: string;
  redirect: string;
  personal_access_client: boolean;
  password_client: boolean;
  revoked: boolean;
  created_at: string;
  updated_at: string;
}

export class ClientInfraMapper {
  public static fromDomain(client: Client): ClientInfraDto {
    return {
      id: client.id,
      user_id: client.userId,
      name: client.name,
      provider: client.provider,
      redirect: client.redirect,
      personal_access_client: client.personalAccessClient,
      password_client: client.passwordClient,
      revoked: client.revoked,
      created_at: client.createdAt.toISOString(),
      updated_at: client.updatedAt.toISOString(),
    };
  }

  public static toDomain(dto: ClientInfraDto): Client {
    return new Client(
      dto.id,
      dto.user_id,
      dto.name,
      dto.provider,
      dto.redirect,
      dto.personal_access_client,
      dto.password_client,
      dto.revoked,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
