/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  limit: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  offset: number;
}
