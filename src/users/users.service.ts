import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserEntity from './user.entity';
import CreateUserDto from './dto/create-user.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private usersRepository: Repository<UserEntity>
	) {}

	async getAllUsers(): Promise<UserEntity[]> {
		return await this.usersRepository.find();
	}
	async getByUsername(username: string): Promise<UserEntity> {
		const user = await this.usersRepository.findOne({ username });
		if (user) {
			return user;
		}
		throw new HttpException(
			'Пользователя с таким именем пользователя не существует',
			HttpStatus.NOT_FOUND
		);
	}
	async getById(id: number) {
		const user = await this.usersRepository.findOne({ id });
		if (user) {
			return user;
		}
		throw new HttpException(
			'Пользователь с таким ID не найден',
			HttpStatus.NOT_FOUND
		);
	}

	async create(userData: CreateUserDto): Promise<UserEntity> {
		const newUser = await this.usersRepository.create(userData);
		await this.usersRepository.save(newUser);
		return newUser;
	}
}
