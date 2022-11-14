import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CreateChatRoomDto } from './create-chatroom.dto';

export class UpdateChatRoomDto extends PartialType(CreateChatRoomDto) {
	@IsOptional()
	@MinLength(1)
	@MaxLength(150)
	@IsString()
	@ApiProperty()
	nickname: string;

	@IsOptional()
	@IsNumber()
	@ApiPropertyOptional({default: "60" })
	duration: number;
}
