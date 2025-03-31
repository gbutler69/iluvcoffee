import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly limit?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly offset?: number;
}
