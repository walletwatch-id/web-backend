import { Scope } from '@/domain/entities';

export interface ScopeUIDto {
  id: string;
  description: string;
}

export class ScopeUIMapper {
  public static fromDomain(scope: Scope): ScopeUIDto {
    return {
      id: scope.id,
      description: scope.description,
    };
  }

  public static toDomain(dto: ScopeUIDto): Scope {
    return new Scope(dto.id, dto.description);
  }
}
