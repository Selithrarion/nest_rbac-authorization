import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import JwtStrategy from './jwt/jwt.strategy';

@Module({
	imports: [
		JwtModule.register({
			secret: 'secret',
			signOptions: { expiresIn: '30d' },
		}),
		UsersModule,
		PassportModule,
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
	],
	exports: [AuthService],
})
export class AuthModule {
	constructor() {}
}
