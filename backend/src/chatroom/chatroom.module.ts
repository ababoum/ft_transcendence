import { Module } from '@nestjs/common';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChatRoomGateway } from './chatroom.gateway';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';


@Module({
  controllers: [ChatroomController],
  providers: [ChatroomService, PrismaService, ChatRoomGateway, JwtService, UserService]
})
export class ChatroomModule {}
