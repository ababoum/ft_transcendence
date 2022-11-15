import {
	IsNumberString,
	Length, MinLength
} from 'class-validator';

export class TwoFactorAuthenticationCodeDto {

	@Length(6, 6)
	@IsNumberString()
	twoFactorAuthenticationCode: string;
};

export class TwoFactorAuthenticationDto {

	@MinLength(1)
	login: string;

	@Length(6, 6)
	@IsNumberString()
	twoFactorAuthenticationCode: string;
};