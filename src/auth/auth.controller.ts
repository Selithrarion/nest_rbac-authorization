import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import RegisterDto from './dto/register.dto';
import UserEntity from '../users/user.entity';
import LocalAuthGuard from './local/local-auth.guard';
import JwtAuthenticationGuard from './jwt/jwt-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get()
	authenticate(@Req() req) {
		const user = req.user;
		user.password = undefined;
		return user;
	}

	@Post('register')
	async register(@Body() regData: RegisterDto): Promise<UserEntity> {
		return this.authService.register(regData);
	}

	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() req, @Res() res) {
		const { user } = req;
		const cookie = this.authService.getCookieWithJwtToken(user.id);
		res.setHeader('Set-Cookie', cookie);
		user.password = undefined;
		return res.send(user);
	}

	@Post('logout')
	@UseGuards(JwtAuthenticationGuard)
	async logout(@Req() req, @Res() res) {
		res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
		return res.sendStatus(200);
	}
}
