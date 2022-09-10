import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'user_id',
	})
	id: number;

	@Column({
		name: 'login',
		nullable: false,
		default: ''
	})
	login: string;

	@Column({
		name: 'nickname',
		nullable: false,
		default: ''
	})
	nickname: string;

	@Column({
		name: 'email_address',
		nullable: false,
		default: '',
	})
	email: string;

	@Column({
		nullable: false,
		default: '',
	})
	password: string;
};