import { Column, Entity } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Avatar {

	@Column({
		name: 'title',
		nullable: false,
		default: ''
	})
	title: string;

	@Column({
		name: 'image',
		nullable: false
	})
	image: string;

	@Column({
		name: 'uploadDate',
		nullable: false,
		default: Date.now()
	})
	uploadDate: Date;

	@Column({
		name: 'uploadedBy',
		nullable: false
	})
	uploadedBy: User;

};