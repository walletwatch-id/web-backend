import { Scope } from '@/domain/entities';

export interface ScopeInfraDto {
  id: string;
  description: string;
}

export class ScopeInfraMapper {
  public static fromDomain(scope: Scope): ScopeInfraDto {
    return {
      id: scope.id,
      description: scope.description,
    };
  }

  public static toDomain(dto: ScopeInfraDto): Scope {
    return new Scope(dto.id, dto.description);
  }
}
