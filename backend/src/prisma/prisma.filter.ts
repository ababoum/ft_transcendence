import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';


function format_prisma_message(
	message: string,
	response: Response<any, Record<string, any>>)
	: void {

	const status = HttpStatus.CONFLICT;

	response.status(status).json({
		statusCode: status,
		message: message,
	});
}


@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
	catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		switch (exception.code) {
			case 'P2000':
				format_prisma_message(
					`The provided value for the column is too long for the column's type. Column: ${exception.meta.target}`,
					response);
				break;

			case 'P2001':
				format_prisma_message(
					`The record searched for in the where condition does not exist`,
					response);
				break;

			case 'P2002':
				format_prisma_message(
					`Unique constraint failed on field ${exception.meta.target}`,
					response);
				break;

			case 'P2025':
				format_prisma_message(
					`${exception.meta.cause}`,
					response);
				break;

			default:
				console.log(exception)
				// default 500 error code
				super.catch(exception, host);
				break;
		}

	}
}