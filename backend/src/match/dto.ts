import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, Min } from "class-validator";

export class createMatchDTO {
	
	@IsNotEmpty()
	@ApiProperty()
	winnerLogin: string;

	@IsNotEmpty()
	@ApiProperty()
	loserLogin: string;

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@ApiProperty()
	winnerScore: number;

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@ApiProperty()
	loserScore: number;
}