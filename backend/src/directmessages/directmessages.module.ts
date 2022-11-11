import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DirectmessagesController } from './directmessages.controller';
import { DirectmessagesGateway } from './directmessages.gateway';
import { DirectmessagesService } from './directmessages.service';

@Module({
  controllers: [DirectmessagesController],
  providers: [	DirectmessagesService,
				DirectmessagesGateway,
				PrismaService]
})
export class DirectmessagesModule {}
