import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class createMatchDTO {

	@IsNotEmpty()
	@ApiProperty()
	winnerLogin: string;

	@IsNotEmpty()
	@ApiProperty()
	loserLogin: string;

	@Min(0)
	@IsInt()
	@ApiProperty()
	winnerScore: number;

	@Min(0)
	@IsInt()
	@ApiProperty()
	loserScore: number;
}
