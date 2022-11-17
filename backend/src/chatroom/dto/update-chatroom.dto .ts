import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
	IsAlphanumeric,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength
} from 'class-validator';
import { CreateChatRoomDto } from './create-chatroom.dto';

export class UpdateChatRoomDto extends PartialType(CreateChatRoomDto) {
	@IsOptional()
	@MinLength(1)
	@MaxLength(150)
	@IsString()
	@Matches(/^[ A-Za-z0-9_@.-]*$/)
	@ApiProperty()
	nickname: string;

	@IsOptional()
	@IsNumber()
	@ApiPropertyOptional({ default: "60" })
	duration: number;
}
