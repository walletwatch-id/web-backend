import { DateTime } from 'luxon';
import { User } from '@/domain/entities';

export interface UserUIDto {
  id: string;
  name: string;
  email: string;
  emailVerifiedAt: string;
  picture: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export class UserUIMapper {
  public static fromDomain(user: User): UserUIDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt,
      picture: user.picture,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  public static toDomain(dto: UserUIDto): User {
    return new User(
      dto.id,
      dto.name,
      dto.email,
      dto.emailVerifiedAt,
      dto.picture,
      dto.role,
      DateTime.fromISO(dto.createdAt).toJSDate(),
      DateTime.fromISO(dto.updatedAt).toJSDate(),
    );
  }
}
