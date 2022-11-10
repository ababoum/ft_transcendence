import { PrismaService } from '../prisma/prisma.service';
import { HttpCode, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class DirectmessagesService {
	constructor(private prisma: PrismaService) {}


}
