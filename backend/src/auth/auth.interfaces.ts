import { Request } from 'express';
import { User as UserModel } from '@prisma/client';

export interface RequestWithUser extends Request {
	user: UserModel;
}


export interface TokenPayload {
	userId: number;
	isSecondFactorAuthenticated: boolean;
}