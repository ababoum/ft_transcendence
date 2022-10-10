import { Module } from '@nestjs/common';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';
import { PrismaService } from '../prisma/prisma.service';


@Module({
  controllers: [ChatroomController],
  providers: [ChatroomService, PrismaService]
})
export class ChatroomModule {}
