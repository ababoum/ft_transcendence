import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'user_id',
	})
	id: number;

	@Index({ unique: true })
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

	@Index({ unique: true })
	@Column({
		name: 'email_address',
		nullable: false,
		default: ''
	})
	email: string;

	@Column({
		nullable: false,
		default: '',
	})
	password: string;
};