import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsString,
	MinLength,
} from 'class-validator';

export class MessageDto {
  @IsNotEmpty()
  @MinLength(1)
  @IsString()
  @ApiProperty()
  content: string;
}
