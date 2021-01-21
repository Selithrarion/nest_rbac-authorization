import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import RegisterDto from './dto/register.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {}

	public async register(regData: RegisterDto) {
		const hashedPassword = await bcrypt.hash(regData.password, 10);
		try {
			const createdUser = await this.usersService.create({
				...regData,
				password: hashedPassword,
			});
			createdUser.password = undefined;
			return createdUser;
		} catch (error) {
			throw new HttpException(
				'Что-то пошло не так',
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	async getAuthUser(username: string, plainPassword: string) {
		try {
			const user = await this.usersService.getByUsername(username);
			await this.verifyPassword(plainPassword, user.password);
			user.password = undefined;
			return user;
		} catch (error) {
			throw new HttpException(
				'Неправильный логин или пароль',
				HttpStatus.BAD_REQUEST
			);
		}
	}

	async verifyPassword(plainPassword: string, hashedPassword: string) {
		const isPasswordMatching = await bcrypt.compare(
			plainPassword,
			hashedPassword
		);
		if (!isPasswordMatching) {
			throw new HttpException(
				'Неправильный логин или пароль',
				HttpStatus.BAD_REQUEST
			);
		}
	}

	getCookieWithJwtToken(id: number) {
		const payload = { id };
		const token = this.jwtService.sign(payload);
		return `Authentication=${token}; HttpOnly; Path=/; Max-Age=30d`;
	}
	getCookieForLogOut() {
		return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
	}
}
