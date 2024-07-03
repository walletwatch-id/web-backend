import { DateTime } from 'luxon';
import { User } from '@/domain/entities';

export interface UserInfraDto {
  id: string;
  name: string;
  email: string;
  email_verified_at: string;
  picture: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export class UserInfraMapper {
  public static fromDomain(user: User): UserInfraDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      email_verified_at: user.emailVerifiedAt,
      picture: user.picture,
      role: user.role,
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt.toISOString(),
    };
  }

  public static toDomain(dto: UserInfraDto): User {
    return new User(
      dto.id,
      dto.name,
      dto.email,
      dto.email_verified_at,
      dto.picture,
      dto.role,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
