import { Module } from '@nestjs/common';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChatRoomGateway } from './chatroom.gateway';


@Module({
  controllers: [ChatroomController],
  providers: [ChatroomService, PrismaService, ChatRoomGateway]
})
export class ChatroomModule {}
