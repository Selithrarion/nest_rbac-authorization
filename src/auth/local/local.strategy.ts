import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import UserEntity from '../../users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({
			usernameField: 'username',
		});
	}
	async validate(username: string, password: string): Promise<UserEntity> {
		return this.authService.getAuthUser(username, password);
	}
}
