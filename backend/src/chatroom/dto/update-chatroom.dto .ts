import { ApiProperty, PartialType } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateChatRoomDto } from './create-chatroom.dto';

export class UpdateChatRoomDto extends PartialType(CreateChatRoomDto) {
	@IsOptional()
	@ApiProperty()
	participants: User;
}
