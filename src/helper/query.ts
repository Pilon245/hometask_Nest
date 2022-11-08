// import { Transform } from 'class-transformer';
// import {
//   IsBoolean,
//   IsDate,
//   IsNumber,
//   IsNumberString,
//   IsOptional,
//   IsString,
// } from 'class-validator';
// import { toBoolean, toDate, toLowerCase, toNumber, trim } from './query.dto';
//
// export class QueryDto {
//   @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
//   @IsNumber()
//   @IsOptional()
//   public pageNumber = 1;
//
//   @Transform(({ value }) => toNumber(value, { default: 10, min: 1 }))
//   @IsNumber()
//   @IsOptional()
//   public pageSize = 10;
//
//   @Transform(({ value }) => ())
//   @IsString()
//   @IsOptional()
//   public sortDirection = value.toString() === 'asc' ? '1' : '-1';
//
//   const sortDirection = typeof query.sortDirection === 'string' ? +query.sortDirection : -1
//
//   @Transform(({ value }) => trim(value))
//   @IsOptional()
//   public bar: string;
//
//   @Transform(({ value }) => toLowerCase(value))
//   @IsOptional()
//   public elon: string;
//
//   @IsNumberString()
//   @IsOptional()
//   public musk: string;
//
//   @Transform(({ value }) => toDate(value))
//   @IsDate()
//   @IsOptional()
//   public date: Date;
// }
