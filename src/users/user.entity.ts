import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import UserRoles from './enum/roles.enum';
import { IsInt, IsString } from 'class-validator';

@Entity()
class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@IsString()
	@Column({ unique: true })
	username: string;

	@IsString()
	@Column()
	password: string;

	@Column({
		type: 'enum',
		enum: UserRoles,
		default: UserRoles.USER,
	})
	role: UserRoles;
}

export default UserEntity;
