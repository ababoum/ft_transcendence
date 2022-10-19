import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsNumberString, IsPositive, Min } from "class-validator";

export class createMatchDTO {

	@IsNotEmpty()
	@ApiProperty()
	winnerLogin: string;

	@IsNotEmpty()
	@ApiProperty()
	loserLogin: string;

	// @Transform(({ value }) => parseInt(value))
	@Min(0)
	@IsInt()
	@ApiProperty()
	winnerScore: number;

	// @Transform(({ value }) => parseInt(value))
	@Min(0)
	@IsInt()
	@ApiProperty()
	loserScore: number;
}