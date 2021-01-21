import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly usersService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req) => {
					return req?.cookies?.Authentication;
				},
			]),
			ignoreExpiration: false,
			secretOrKey: 'secret',
		});
	}

	async validate(payload) {
		return this.usersService.getById(payload.id);
	}
}
