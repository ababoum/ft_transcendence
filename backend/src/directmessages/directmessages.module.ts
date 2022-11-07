import { Module } from '@nestjs/common';
import { DirectmessagesController } from './directmessages.controller';
import { DirectmessagesGateway } from './directmessages.gateway';
import { DirectmessagesService } from './directmessages.service';

@Module({
  controllers: [DirectmessagesController],
  providers: [	DirectmessagesService,
				DirectmessagesGateway]
})
export class DirectmessagesModule {}
