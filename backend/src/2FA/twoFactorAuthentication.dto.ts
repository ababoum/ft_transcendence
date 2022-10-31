import {
	Length
} from 'class-validator';

export class TwoFactorAuthenticationCodeDto {

	@Length(6, 6)
	twoFactorAuthenticationCode: string;
};