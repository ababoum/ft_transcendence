import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @MaxLength(1)
  @ApiProperty()
  login: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}