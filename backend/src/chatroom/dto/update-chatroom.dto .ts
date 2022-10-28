import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, MinLength } from 'class-validator';
import { CreateChatRoomDto } from './create-chatroom.dto';

export class UpdateChatRoomDto extends PartialType(CreateChatRoomDto) {
	@IsOptional()
	@ApiProperty()
	nickname: string;

	@IsOptional()
	@IsNumber()
	@ApiPropertyOptional({default: "60" })
	duration: number;
}
